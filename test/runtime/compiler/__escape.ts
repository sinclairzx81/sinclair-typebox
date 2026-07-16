import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

declare global {
  var __global_state__: boolean
}
describe('compiler/Escape', () => {
  // ----------------------------------------------------------------
  // Literal
  // ----------------------------------------------------------------
  it('Should escape Literal', () => {
    global.__global_state__ = false
    const schema = Type.Literal(JSON.parse(String.raw`{"allowedValue":"x\\',__global_state__=true,true)//"}`).allowedValue)
    const checker = TypeCompiler.Compile(schema)
    Assert.isFalse(global.__global_state__)
    checker.Check(null)
    Assert.isFalse(global.__global_state__)
  })
  // ----------------------------------------------------------------
  // Format
  // ----------------------------------------------------------------
  it('Should escape Format', () => {
    global.__global_state__ = false
    const format = JSON.parse('{"format":"x\', value), globalThis.__global_state__ = true, format(\'x"}').format
    const schema = Type.String({ format })
    const checker = TypeCompiler.Compile(schema)
    Assert.isFalse(global.__global_state__)
    checker.Check(null)
    Assert.isFalse(global.__global_state__)
  })
  // ----------------------------------------------------------------
  // Object: PropertyKey
  // ----------------------------------------------------------------
  it('Should escape Object Property Key', () => {
    global.__global_state__ = false
    const maliciousKey = JSON.parse(String.raw`{"key":"x' in value), globalThis.__global_state__ = true, ('x"}`).key
    const schema = Type.Object({
      [maliciousKey]: Type.Union([Type.String(), Type.Undefined()]),
    })
    const checker = TypeCompiler.Compile(schema)
    Assert.isFalse(global.__global_state__)
    checker.Check('not even an object')
    Assert.isFalse(global.__global_state__)
  })
  // ----------------------------------------------------------------
  // Object: AdditionalProperties (False)
  // ----------------------------------------------------------------
  it('Should escape Object AdditionalProperties', () => {
    global.__global_state__ = false
    const maliciousKey = JSON.parse(String.raw`{"key":"x'], globalThis.__global_state__ = true, ['x"}`).key
    const schema = Type.Object(
      {
        safe: Type.String(),
        [maliciousKey]: Type.Optional(Type.String()),
      },
      { additionalProperties: false },
    )
    const checker = TypeCompiler.Compile(schema)
    Assert.isFalse(global.__global_state__)
    checker.Check(null)
    Assert.isFalse(global.__global_state__)
    checker.Check({ safe: 'hello' }) // satisfies required props, actually reaches the additionalProperties clause
    Assert.isFalse(global.__global_state__)
  })
  // ----------------------------------------------------------------
  // Object: AdditionalProperties (Schema Keys Array)
  // ----------------------------------------------------------------
  it('Should escape Object (additionalProperties schema keys array)', () => {
    global.__global_state__ = false
    const maliciousKey = JSON.parse(String.raw`{"key":"x'], globalThis.__global_state__ = true, ['x"}`).key
    const schema = Type.Object(
      {
        safe: Type.String(),
        [maliciousKey]: Type.Optional(Type.String()),
      },
      { additionalProperties: Type.String() }, // typeof schema.additionalProperties === 'object'
    )
    const checker = TypeCompiler.Compile(schema)
    Assert.isFalse(global.__global_state__)
    checker.Check(null)
    Assert.isFalse(global.__global_state__)
    checker.Check({ safe: 'hello' }) // satisfies required props, forces evaluation of this clause
    Assert.isFalse(global.__global_state__)
  })
})
