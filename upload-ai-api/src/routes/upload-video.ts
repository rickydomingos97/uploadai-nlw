import { FastifyInstance } from "fastify/types/instance";
import { prisma } from "../lib/prisma";
import { fastifyMultipart } from "@fastify/multipart";
import path from "node:path"; // modulo interno do node
import { randomUUID } from "node:crypto";
import fs from 'node:fs';
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25 // 25mb
    }
  })



  app.post('/videos', async (request, reply) => {
    const data = await request.file()

    if (!data) {
      return reply.status(400).send({ error: 'Missing file input!'})
    }

    //se passou desse erro significa que temos o arquivo
    // entao pego a extensao do arquivo

    const extension = path.extname(data.filename) 
    // retorna a extensao do arquivo
    if ( extension != '.mp3') {
      return reply.status(400).send({ error: 'Invalid input type! PLase upload a MP3 file.' })
    }

    //criando um novo nome para o arquivo
    const fileBaseName = path.basename(data.filename, extension)
    //criando o novo nome sem a extensao
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
    //retornando o novo nome com um id unico
    const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

    await pump(data.file, fs.createWriteStream(uploadDestination))

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination,
      }
    })

    return {
      video,
    }
  })
}