export default class WorkerClient {
	worker: Worker

	constructor() {
		const blob = new Blob([
			document.getElementById('worker-template')!.textContent!,
		])
		this.worker = new Worker(window.URL.createObjectURL(blob))
		this.worker.addEventListener('message', this.handleMessage.bind(this))
	}

	handleMessage(): void {
		parent.postMessage(
			{
				pluginMessage: {
					command: 'parsed',
					data: {},
				},
			},
			'*'
		)
	}
}
