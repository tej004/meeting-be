import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import {
  MediaKind,
  RtpCodecCapability,
} from 'mediasoup/node/lib/rtpParametersTypes'
import * as mediasoup from 'mediasoup'
import type { Worker } from 'mediasoup/node/lib/WorkerTypes'
import type { Router } from 'mediasoup/node/lib/RouterTypes'

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly _numOfWorkers = parseInt(process.env.NUM_OF_WORKERS || '1')
  private workers: Map<string, Worker> = new Map()
  private workerLoad: Map<string, number> = new Map()
  private mediaCodecs: RtpCodecCapability[] = [
    {
      kind: 'audio' as MediaKind,
      mimeType: 'audio/opus',
      clockRate: 48000,
      channels: 2,
      preferredPayloadType: 111,
    },
    {
      kind: 'video' as MediaKind,
      mimeType: 'video/H264',
      clockRate: 90000,
      parameters: {
        'packetization-mode': 1,
        'profile-level-id': '42e01f',
        'level-asymmetry-allowed': 1,
      },
      preferredPayloadType: 102,
    },
    {
      kind: 'video' as MediaKind,
      mimeType: 'video/H264',
      clockRate: 90000,
      parameters: {},
      preferredPayloadType: 103,
    },
  ]

  async onModuleInit() {
    for (let i = 0; i < this._numOfWorkers; i++) {
      const worker = await mediasoup.createWorker({
        rtcMinPort: 40000,
        rtcMaxPort: 49999,
        logLevel: 'warn',
        logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
      })

      this.workers.set(String(i), worker)
      this.workerLoad.set(String(i), 0)

      worker.on('died', () => {
        console.log(`Worker PID ${i} died`)
        process.exit(1)
      })
    }
  }

  getLeastWorker(): { worker: Worker; workerKey: string } {
    let currentLeastLoadedWorkerKey: string | null = null
    let currentLeastLoadedWorkerValue: number | null = Infinity

    for (const [key, value] of this.workerLoad) {
      if (value < currentLeastLoadedWorkerValue) {
        currentLeastLoadedWorkerKey = key
        currentLeastLoadedWorkerValue = value
      }
    }

    if (currentLeastLoadedWorkerKey === null)
      throw new Error('No worker found.')

    if (!this.workers.has(currentLeastLoadedWorkerKey))
      throw new Error('No worker found.')

    return {
      worker: this.workers.get(currentLeastLoadedWorkerKey)!,
      workerKey: currentLeastLoadedWorkerKey,
    }
  }

  async createRouter(): Promise<Router> {
    const { worker, workerKey } = this.getLeastWorker()

    const currentLoad = this.workerLoad.get(workerKey)!
    this.workerLoad.set(workerKey, currentLoad + 1)

    const router = await worker.createRouter({ mediaCodecs: this.mediaCodecs })
    return router
  }

  async onModuleDestroy() {}
}
