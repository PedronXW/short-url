import { HashComparer } from '@/@shared/criptography/hash-comparer'
import { HashGenerator } from '@/@shared/criptography/hash-generator'
import { compare, hash } from 'bcryptjs'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
