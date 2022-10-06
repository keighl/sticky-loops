import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'

import WorkerClient from './workerClient'
import App from './components/App'
import { useStore } from './store'
import { FS } from '../types'

import 'normalize.css'
import './style/main.css'

// Instantiate a worker
const workerClient = new WorkerClient()

const root = createRoot(document.getElementById('root')!)
root.render(<App />)

const updateStepData = (stepData: FS.StepData.Column[]) => {
	useStore.setState({ stepData })
}

// Handling messages from the main plugin code
window.onmessage = (event) => {
	const message = event.data.pluginMessage
	const { command } = message

	if (!command) {
		throw new Error('No command in plugin message.')
	}

	switch (command) {
		case 'play_instructions':
			const { data } = message as FS.PluginMessage<FS.StepData.Column[]>
			updateStepData(data)

			break
		default:
			console.warn(`No method for ${command}`)
			break
	}
}
