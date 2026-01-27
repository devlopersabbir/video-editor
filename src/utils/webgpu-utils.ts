import type { RendererCapabilities } from '../types/types';

/**
 * Detect WebGPU support in the current browser
 */
export async function detectWebGPU(): Promise<RendererCapabilities> {
  if (!navigator.gpu) {
    return {
      type: 'canvas2d',
      supportsWebGPU: false,
      maxTextureSize: 4096,
    };
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      return {
        type: 'canvas2d',
        supportsWebGPU: false,
        maxTextureSize: 4096,
      };
    }

    const device = await adapter.requestDevice();
    const maxTextureSize = adapter.limits.maxTextureDimension2D || 8192;

    // Clean up
    device.destroy();

    return {
      type: 'webgpu',
      supportsWebGPU: true,
      maxTextureSize,
    };
  } catch (error) {
    console.warn('WebGPU detection failed:', error);
    return {
      type: 'canvas2d',
      supportsWebGPU: false,
      maxTextureSize: 4096,
    };
  }
}

/**
 * Create a shader module from WGSL code
 */
export function createShaderModule(device: GPUDevice, code: string): GPUShaderModule {
  return device.createShaderModule({ code });
}

/**
 * Create a texture from an image or video element
 */
export async function createTextureFromImage(
  device: GPUDevice,
  source: HTMLImageElement | HTMLVideoElement | ImageBitmap
): Promise<GPUTexture> {
  const texture = device.createTexture({
    size: {
      width: source.width,
      height: source.height,
    },
    format: 'rgba8unorm',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
  });

  device.queue.copyExternalImageToTexture(
    { source },
    { texture },
    {
      width: source.width,
      height: source.height,
    }
  );

  return texture;
}

/**
 * Create a uniform buffer
 */
export function createUniformBuffer(device: GPUDevice, size: number): GPUBuffer {
  return device.createBuffer({
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
}

/**
 * Basic vertex shader for rendering textured quads
 */
export const VERTEX_SHADER = `
struct VertexInput {
  @location(0) position: vec2f,
  @location(1) texCoord: vec2f,
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) texCoord: vec2f,
}

struct Uniforms {
  transform: mat4x4f,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  output.position = uniforms.transform * vec4f(input.position, 0.0, 1.0);
  output.texCoord = input.texCoord;
  return output;
}
`;

/**
 * Basic fragment shader for rendering textures
 */
export const FRAGMENT_SHADER = `
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var textureData: texture_2d<f32>;

@fragment
fn main(@location(0) texCoord: vec2f) -> @location(0) vec4f {
  return textureSample(textureData, textureSampler, texCoord);
}
`;
