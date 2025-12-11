import { CONFIGS } from '@/config/constants/configs.constant'
import { IEncryptionConfig } from '@/config/types/interface/encryption.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto'

@Injectable()
export class EncryptionService {
  private algorithm: string
  private ivLength: number
  private key: Buffer

  constructor(private readonly configService: ConfigService) {
    this.key = Buffer.from(
      this.configService.get<IEncryptionConfig>(CONFIGS.ENCRYPTION)!.key,
      'utf-8'
    )

    this.ivLength = this.configService.get<IEncryptionConfig>(
      CONFIGS.ENCRYPTION
    )!.ivLength

    this.algorithm = this.configService.get<IEncryptionConfig>(
      CONFIGS.ENCRYPTION
    )!.algorithm

    console.log('EncryptionService initialized with algorithm:', this.algorithm)
    console.log('Key length (bytes):', this.key)
    console.log('IV length (bytes):', this.ivLength)
  }

  encrypt(text: string) {
    const iv = crypto.randomBytes(this.ivLength)
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.key,
      iv
    ) as crypto.CipherGCM

    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ])
    const authTag = cipher.getAuthTag()

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
  }

  decrypt(encryptedText: string) {
    const [ivHex, authTagHex, dataHex] = encryptedText.split(':')

    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    const encrypted = Buffer.from(dataHex, 'hex')

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      iv
    ) as crypto.DecipherGCM
    decipher.setAuthTag(authTag)

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ])

    return decrypted.toString('utf8')
  }
}
