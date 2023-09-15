import { fastify } from 'fastify'
import { getAllPromptRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'
import { createTranscriptionRoute } from './routes/create-transcription'

const app = fastify()

app.register(getAllPromptRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)

app.listen({
  port: 3333,
}).then(() => {
  console.log('HTTP Server Running!')
})