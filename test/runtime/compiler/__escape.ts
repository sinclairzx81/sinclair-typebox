import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

declare global {
  var __global_state__: { pwned: boolean }
}

describe('compiler/Escape', () => {
  it('Ensure Escape for Dynamic String', () => {
    global.__global_state__ = { pwned: false }
    // Suspicious String Literal
    const schema = Type.Literal(JSON.parse(String.raw`{"allowedValue":"x\\',__global_state__.pwned=true,true)//"}`).allowedValue)
    // Assert State
    const checker = TypeCompiler.Compile(schema)
    Assert.IsFalse(global.__global_state__.pwned)
    // Assert State
    checker.Check(null)
    Assert.IsFalse(global.__global_state__.pwned)
    // Assert Result
    const A = checker.Check('...')
    const B = checker.Check("x\\',__global_state__.pwned=true,true)//")
    Assert.IsFalse(A)
    Assert.IsTrue(B)
  })
})
