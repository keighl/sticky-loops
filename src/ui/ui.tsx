import ReactDOM from 'react-dom'

import WorkerClient from './workerClient'
import App from './components/App'
import { Store_SequenceData, useStore } from './store'
import { StepSeq } from '../types'

// Instantiate a worker
const workerClient = new WorkerClient()

ReactDOM.render(<App />, document.getElementById('root'))

const updateSequenceData = (sequenceData: Store_SequenceData) => {
	useStore.setState({ sequenceData })
}

// Handling messages from the main plugin code
window.onmessage = (event) => {
	const message = event.data.pluginMessage as StepSeq.FigmaPluginMessage
	const { command } = message

	if (!command) {
		throw new Error('No command in plugin message.')
	}

	switch (command) {
		case 'play_instructions':
			// workerClient.worker.postMessage({
			// 	// data: event.data.pluginMessage.data,
			// 	// id: event.data.pluginMessage.id,
			// })
			const { data } = message
			updateSequenceData(data)

			break
		default:
			console.warn(`No method for ${command}`)
			break
	}
}
