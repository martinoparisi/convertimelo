ti ho allegato due immagini, ora te le spiego:

- nell'immagine che rappresenta una schermata di login: vorrei che per accedere ci fosse quel pop up che viene mostrato se si clicca "accedi" in alto a sinistra oppure che appare a schermo dopo la prima conversione (ignorabile con accesso non obbligatorio)
- nell'altra immagine c'è un esempio di come voglio l'elemento per scegliere il tipo di conversione

- poi nel manipolatore di testo fai funzionare l'ai di riassunto (usando le funzioni AI di firebase)
- nella visualizzazione da mobile si vede sia un hamburgher menu con dentro le possibili conversioni, sia una barra sotto l'header, anche li lascia nell'header solo la cronologia e sotto mettici il resto rimuovendo l'hamburgher menu
- dentro il popup dell'account vorrei ci fosse scritto "Ciao [nomeutente]!" con accanto una matita che permette di modificare il nome utente
- nel convertitore di file il "sfoglia" permette di inserire solo file immagine, fai in modo che permetta di cercare ogni tipo di file
- dai più importanza al logo nell'header rendendolo più grande e togli il contorno bianco che ha
- ho notato anche che la cronologia non si salva nel database, ma rimane fino a che la pagina non viene aggiornata, vorrei che si salvasse nel database (se necessario fammi un file txt con le cose da copiare su firebase per creare la struttura del database)
- vorrei che ci fosse un pulsante per cancellare la cronologia
- vorrei che ci fosse un pulsante per la dark mode e la light mode nell'header vicino alla cronologia
- vorrei che la grafica dei convertitori unita valuta e testo fosse uguale a quella del file e della cronologia, stessi effetti di illuminazione ecc...
- vorrei che l'utente potesse scegliere il nome utente, e che per ogni utente sia salvato il nel database il nome utente, la preferenza di tema (chiaro o scuro) e le conversioni effettuate (per ogni conversione salvare la data, l'ora, il tipo di conversione, il risultato e la conversione ECCETTO PER I FILE, DEVE SOLO ESSERCI IL NOME DEL FILE E NON IL FILE)
- risolvi tutti i warning e errori nel terminale
- il convertitore di unitàda questo errore quando è usato "unit-converter.component.ts:131 HttpErrorResponse
(anonymous) @ unit-converter.component.ts:131
127.0.0.1:5001/convertimelo/us-central1/unit_converter:1  Failed to load resource: net::ERR_CONNECTION_REFUSED"
- il convertitore di testo da questo errore "text-manipulator.component.ts:83 HttpErrorResponse {headers: _HttpHeaders, status: 0, statusText: 'Unknown Error', url: 'http://127.0.0.1:5001/convertimelo/us-central1/text_manipulator', ok: false, …}
(anonymous) @ text-manipulator.component.ts:83
rejected @ main.js:12
invoke @ zone.js:398
onInvoke @ debug_node.mjs:7854
invoke @ zone.js:397
run @ zone.js:113
(anonymous) @ zone.js:2537
invokeTask @ zone.js:431
(anonymous) @ debug_node.mjs:7516
onInvokeTask @ debug_node.mjs:7516
invokeTask @ zone.js:430
onInvokeTask @ debug_node.mjs:7841
invokeTask @ zone.js:430
runTask @ zone.js:161
drainMicroTaskQueue @ zone.js:612
invokeTask @ zone.js:519
invokeTask @ zone.js:1141
globalCallback @ zone.js:1172
globalZoneAwareCallback @ zone.js:1205
Zone - Promise.then
onScheduleTask @ debug_node.mjs:7510
scheduleTask @ zone.js:411
onScheduleTask @ zone.js:273
scheduleTask @ zone.js:411
scheduleTask @ zone.js:207
scheduleMicroTask @ zone.js:227
scheduleResolveOrReject @ zone.js:2527
resolvePromise @ zone.js:2461
(anonymous) @ zone.js:2369
(anonymous) @ zone.js:2385
invoke @ zone.js:398
onInvoke @ debug_node.mjs:7854
invoke @ zone.js:397
run @ zone.js:113
(anonymous) @ zone.js:2537
invokeTask @ zone.js:431
(anonymous) @ debug_node.mjs:7516
onInvokeTask @ debug_node.mjs:7516
invokeTask @ zone.js:430
onInvokeTask @ debug_node.mjs:7841
invokeTask @ zone.js:430
runTask @ zone.js:161
drainMicroTaskQueue @ zone.js:612
invokeTask @ zone.js:519
invokeTask @ zone.js:1141
globalCallback @ zone.js:1172
globalZoneAwareCallback @ zone.js:1205
Zone - Promise.then
onScheduleTask @ debug_node.mjs:7510
scheduleTask @ zone.js:411
onScheduleTask @ zone.js:273
scheduleTask @ zone.js:411
scheduleTask @ zone.js:207
scheduleMicroTask @ zone.js:227
scheduleResolveOrReject @ zone.js:2527
resolvePromise @ zone.js:2461
(anonymous) @ zone.js:2369
(anonymous) @ zone.js:2385
ConsumerObserver2.error @ Subscriber.js:107
Subscriber2._error @ Subscriber.js:67
Subscriber2.error @ Subscriber.js:43
Subscriber2._error @ Subscriber.js:67
Subscriber2.error @ Subscriber.js:43
Subscriber2._error @ Subscriber.js:67
Subscriber2.error @ Subscriber.js:43
Subscriber2._error @ Subscriber.js:67
Subscriber2.error @ Subscriber.js:43
Subscriber2._error @ Subscriber.js:67
Subscriber2.error @ Subscriber.js:43
onError @ module.mjs:2688
invokeTask @ zone.js:431
(anonymous) @ debug_node.mjs:7516
onInvokeTask @ debug_node.mjs:7516
invokeTask @ zone.js:430
onInvokeTask @ debug_node.mjs:7841
invokeTask @ zone.js:430
runTask @ zone.js:161
invokeTask @ zone.js:515
invokeTask @ zone.js:1141
globalCallback @ zone.js:1172
globalZoneAwareCallback @ zone.js:1205
Zone - XMLHttpRequest.addEventListener:error
onScheduleTask @ debug_node.mjs:7510
scheduleTask @ zone.js:411
onScheduleTask @ zone.js:273
scheduleTask @ zone.js:411
scheduleTask @ zone.js:207
scheduleEventTask @ zone.js:233
(anonymous) @ zone.js:1498
(anonymous) @ module.mjs:2756
Observable2._trySubscribe @ Observable.js:38
(anonymous) @ Observable.js:32
errorContext @ errorContext.js:19
Observable2.subscribe @ Observable.js:23
(anonymous) @ switchMap.js:14
OperatorSubscriber2._this._next @ OperatorSubscriber.js:15
Subscriber2.next @ Subscriber.js:34
(anonymous) @ innerFrom.js:51
Observable2._trySubscribe @ Observable.js:38
(anonymous) @ Observable.js:32
errorContext @ errorContext.js:19
Observable2.subscribe @ Observable.js:23
(anonymous) @ switchMap.js:10
(anonymous) @ lift.js:10
(anonymous) @ Observable.js:27
errorContext @ errorContext.js:19
Observable2.subscribe @ Observable.js:23
(anonymous) @ finalize.js:5
(anonymous) @ lift.js:10
(anonymous) @ Observable.js:27
errorContext @ errorContext.js:19
Observable2.subscribe @ Observable.js:23
doInnerSub @ mergeInternals.js:19
outerNext @ mergeInternals.js:14
OperatorSubscriber2._this._next @ OperatorSubscriber.js:15
Subscriber2.next @ Subscriber.js:34
(anonymous) @ innerFrom.js:51
Observable2._trySubscribe @ Observable.js:38
(anonymous) @ Observable.js:32
errorContext @ errorContext.js:19
Observable2.subscribe @ Observable.js:23
mergeInternals @ mergeInternals.js:53
(anonymous) @ mergeMap.js:14
(anonymous) @ lift.js:10
(anonymous) @ Observable.js:27
errorContext @ errorContext.js:19
Observable2.subscribe @ Observable.js:23
(anonymous) @ filter.js:6
(anonymous) @ lift.js:10
(anonymous) @ Observable.js:27
errorContext @ errorContext.js:19
Observable2.subscribe @ Observable.js:23
(anonymous) @ map.js:6
(anonymous) @ lift.js:10
(anonymous) @ Observable.js:27
errorContext @ errorContext.js:19
Observable2.subscribe @ Observable.js:23
(anonymous) @ firstValueFrom.js:21
ZoneAwarePromise @ zone.js:2701
firstValueFrom @ firstValueFrom.js:5
(anonymous) @ converter.service.ts:35
(anonymous) @ main.js:18
ZoneAwarePromise @ zone.js:2701
__async @ main.js:2
manipulateText @ converter.service.ts:34
(anonymous) @ text-manipulator.component.ts:78
(anonymous) @ main.js:18
ZoneAwarePromise @ zone.js:2701
__async @ main.js:2
manipulate @ text-manipulator.component.ts:70
TextManipulatorComponent_Template_button_click_11_listener @ text-manipulator.component.ts:26
executeListenerWithErrorHandling @ debug_node.mjs:14112
wrapListenerIn_markDirtyAndPreventDefault @ debug_node.mjs:14095
(anonymous) @ dom_renderer.mjs:746
invokeTask @ zone.js:431
(anonymous) @ debug_node.mjs:7516
onInvokeTask @ debug_node.mjs:7516
invokeTask @ zone.js:430
onInvokeTask @ debug_node.mjs:7841
invokeTask @ zone.js:430
runTask @ zone.js:161
invokeTask @ zone.js:515
invokeTask @ zone.js:1141
globalCallback @ zone.js:1172
globalZoneAwareCallback @ zone.js:1205
converter.service.ts:35  POST http://127.0.0.1:5001/convertimelo/us-central1/text_manipulator net::ERR_CONNECTION_REFUSED"
