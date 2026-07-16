import { Type, Kind, TypeRegistry } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('type/compiler/Custom', () => {
  it('Should validate bigint', () => {
    TypeRegistry.Set('BigInt', (schema, value) => typeof value === 'bigint')
    const T = Type.Unsafe({ [Kind]: 'BigInt' })
    Ok(T, 1n)
    TypeRegistry.Clear()
  })
  it('Should not validate bigint', () => {
    TypeRegistry.Set('BigInt', (schema, value) => typeof value === 'bigint')
    const T = Type.Unsafe({ [Kind]: 'BigInt' })
    Fail(T, 1)
    TypeRegistry.Clear()
  })
  it('Should validate bigint nested', () => {
    TypeRegistry.Set('BigInt', (schema, value) => typeof value === 'bigint')
    const T = Type.Object({
      x: Type.Unsafe({ [Kind]: 'BigInt' }),
    })
    Ok(T, { x: 1n })
    TypeRegistry.Clear()
  })
  it('Should not validate bigint nested', () => {
    TypeRegistry.Set('BigInt', (schema, value) => typeof value === 'bigint')
    const T = Type.Object({
      x: Type.Unsafe({ [Kind]: 'BigInt' }),
    })
    Fail(T, { x: 1 })
    TypeRegistry.Clear()
  })
})
