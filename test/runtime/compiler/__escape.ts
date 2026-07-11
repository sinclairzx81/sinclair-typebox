import { TypeSystemPolicy } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Type, Kind, TypeRegistry } from '@sinclair/typebox'
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
    Assert.IsFalse(global.__global_state__)
    checker.Check(null)
    Assert.IsFalse(global.__global_state__)
  })
  // ----------------------------------------------------------------
  // Format
  // ----------------------------------------------------------------
  it('Should escape Format', () => {
    global.__global_state__ = false
    const format = JSON.parse('{"format":"x\', value), globalThis.__global_state__ = true, format(\'x"}').format
    const schema = Type.String({ format })
    const checker = TypeCompiler.Compile(schema)
    Assert.IsFalse(global.__global_state__)
    checker.Check(null)
    Assert.IsFalse(global.__global_state__)
  })
  // ----------------------------------------------------------------
  // Kind
  // ----------------------------------------------------------------
  it('Should escape Kind', () => {
    TypeRegistry.Set("x', 0, value), globalThis.__global_state__ = true, kind('x", () => true)
    global.__global_state__ = false
    const kind = JSON.parse(String.raw`{"kind":"x', 0, value), globalThis.__global_state__ = true, kind('x"}`).kind
    const schema = { [Kind]: kind }
    const checker = TypeCompiler.Compile(schema as never)
    Assert.IsFalse(global.__global_state__)
    checker.Check(null)
    Assert.IsFalse(global.__global_state__)
    TypeRegistry.Clear()
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
    Assert.IsFalse(global.__global_state__)
    checker.Check('not even an object')
    Assert.IsFalse(global.__global_state__)
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
    Assert.IsFalse(global.__global_state__)
    checker.Check(null)
    Assert.IsFalse(global.__global_state__)
    checker.Check({ safe: 'hello' }) // satisfies required props, actually reaches the additionalProperties clause
    Assert.IsFalse(global.__global_state__)
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
    Assert.IsFalse(global.__global_state__)
    checker.Check(null)
    Assert.IsFalse(global.__global_state__)
    checker.Check({ safe: 'hello' }) // satisfies required props, forces evaluation of this clause
    Assert.IsFalse(global.__global_state__)
  })
  // ----------------------------------------------------------------
  // ExactOptionalPropertyTypes
  // ----------------------------------------------------------------
  it('Should escape ExactOptionalPropertyTypes', () => {
    TypeSystemPolicy.ExactOptionalPropertyTypes = true
    globalThis.__global_state__ = false
    const key = JSON.parse(String.raw`{"key":"x' in value ? true : false),globalThis.__global_state__=true,('x"}`).key
    const schema = Type.Object({
      [key]: Type.Optional(Type.String()),
    })
    const checker = TypeCompiler.Compile(schema)
    Assert.IsFalse(global.__global_state__)
    checker.Check({})
    Assert.IsFalse(global.__global_state__)
    TypeSystemPolicy.ExactOptionalPropertyTypes = false
  })
})
