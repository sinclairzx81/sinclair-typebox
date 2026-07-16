import { Value } from '@sinclair/typebox/value'
import { Type, Kind, TypeRegistry } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Custom', () => {
  const T = Type.Unsafe({ [Kind]: 'CustomCast', default: 'hello' })
  const E = 'hello'
  it('Should upcast from string', () => {
    TypeRegistry.Set('CustomCast', (schema, value) => value === 'hello' || value === 'world')
    const value = 'hello'
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
    TypeRegistry.Clear()
  })
  it('Should upcast from number', () => {
    TypeRegistry.Set('CustomCast', (schema, value) => value === 'hello' || value === 'world')
    const value = 1
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
    TypeRegistry.Clear()
  })
  it('Should upcast from boolean', () => {
    TypeRegistry.Set('CustomCast', (schema, value) => value === 'hello' || value === 'world')
    const value = false
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
    TypeRegistry.Clear()
  })
  it('Should upcast from object', () => {
    TypeRegistry.Set('CustomCast', (schema, value) => value === 'hello' || value === 'world')
    const value = {}
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
    TypeRegistry.Clear()
  })
  it('Should upcast from array', () => {
    TypeRegistry.Set('CustomCast', (schema, value) => value === 'hello' || value === 'world')
    const value = [1]
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
    TypeRegistry.Clear()
  })
  it('Should upcast from undefined', () => {
    TypeRegistry.Set('CustomCast', (schema, value) => value === 'hello' || value === 'world')
    const value = undefined
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
    TypeRegistry.Clear()
  })
  it('Should upcast from null', () => {
    TypeRegistry.Set('CustomCast', (schema, value) => value === 'hello' || value === 'world')
    const value = null
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
    TypeRegistry.Clear()
  })
  it('Should preserve', () => {
    TypeRegistry.Set('CustomCast', (schema, value) => value === 'hello' || value === 'world')
    const value = { a: 'hello', b: 'world' }
    const result = Value.Cast(
      Type.Object({
        a: T,
        b: T,
      }),
      value,
    )
    Assert.deepEqual(result, { a: 'hello', b: 'world' })
    TypeRegistry.Clear()
  })
})
