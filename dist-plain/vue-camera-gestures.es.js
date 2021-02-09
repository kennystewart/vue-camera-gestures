import{load as e}from"@tensorflow-models/mobilenet";import{browser as t,tensor as i}from"@tensorflow/tfjs";import{create as r}from"@tensorflow-models/knn-classifier";import{pushScopeId as s,popScopeId as n,openBlock as a,createBlock as o,renderSlot as u,createCommentVNode as d,withDirectives as c,createVNode as h,vShow as l,toDisplayString as m,withScopeId as g}from"vue";var p=async()=>window.vueCameraGestures_loadMobilenetPromise?(await window.vueCameraGestures_loadMobilenetPromise,window.vueCameraGestures_mobilenet):(window.vueCameraGestures_mobilenet||(window.vueCameraGestures_loadMobilenetPromise=e().then((e=>{window.vueCameraGestures_mobilenet=e})).catch((e=>{throw window.vueCameraGestures_loadMobilenetPromise=void 0,e})),await window.vueCameraGestures_loadMobilenetPromise),window.vueCameraGestures_mobilenet);const f={name:"CameraGestures",props:{doVerification:{type:Boolean,default:!0},fireOnce:{type:Boolean,default:!0},gestures:{type:Array,default:void 0},model:{type:String,default:void 0},neutralTrainingPrompt:{type:String,default:"Maintain a neutral position"},neutralVerificationPrompt:{type:String,default:"Verify neutral position"},requiredAccuracy:{type:Number,default:90},showCameraFeedAfterTrainingCycle:{type:Boolean,default:!0},showCameraFeedDuringTraining:{type:Boolean,default:!0},showCameraFeedDuringVerification:{type:Boolean,default:!0},throttleEvents:{type:Number,default:0},trainingDelay:{type:Number,default:1e3},trainingPromptPrefix:{type:String,default:"Perform a gesture: "},trainingTime:{type:Number,default:3e3},trainNeutralLast:{type:Boolean,default:!1},verificationDelay:{type:Number,default:1e3},verificationPromptPrefix:{type:String,default:"Verify gesture: "},verificationTime:{type:Number,default:1e3}},emits:["done-training","done-verification","neutral","verification-failed"],data:function(){return{videoPlaying:!1,busyLoadingMobilenet:!0,state:"training",preparing:!1,currentGestureIndex:-1,timeStartedWaiting:null,timeToFinishWaiting:null,progress:0,gestureVerifyingCorrectSamples:0,gestureVerifyingIncorrectSamples:0,verifyingRetried:!1,lastGestureIndexDetected:-1,lastGestureDetectedTime:null}},computed:{computedGestures:function(){if(void 0===this.gestures){return Object.keys(this.$attrs).filter((e=>e.startsWith("on"))).map((e=>e.substring(2))).map((e=>e.toLowerCase())).map((e=>{let t=e.replace(/([A-Z])/g," $1");return t=t.charAt(0).toUpperCase()+t.slice(1),{event:e,fireOnce:this.fireOnce,name:t,requiredAccuracy:this.requiredAccuracy,throttleEvent:this.throttleEvents,trainingDelay:this.trainingDelay,trainingPrompt:this.trainingPromptPrefix+t,trainingTime:this.trainingTime,verificationDelay:this.verificationDelay,verificationPrompt:this.verificationPromptPrefix+t,verificationTime:this.verificationTime,isNeutral:!1}}))}return this.gestures.map((e=>{let t;return e.name?t=e.name:(t=e.event.replace(/([A-Z])/g," $1"),t=t.charAt(0).toUpperCase()+t.slice(1)),{event:e.event,fireOnce:void 0===e.fireOnce?this.fireOnce:e.fireOnce,name:t,requiredAccuracy:void 0===e.requiredAccuracy?this.requiredAccuracy:e.requiredAccuracy,throttleEvent:void 0===e.throttleEvent?this.throttleEvents:e.throttleEvent,trainingDelay:void 0===e.trainingDelay?this.trainingDelay:e.trainingDelay,trainingPrompt:void 0===e.trainingPrompt?this.trainingPromptPrefix+t:e.trainingPrompt,trainingTime:void 0===e.trainingTime?this.trainingTime:e.trainingTime,verificationDelay:void 0===e.verificationDelay?this.verificationDelay:e.verificationDelay,verificationPrompt:void 0===e.verificationPrompt?this.verificationPromptPrefix+t:e.verificationPrompt,verificationTime:void 0===e.verificationTime?this.verificationTime:e.verificationTime}}))},currentGesture:function(){return this.currentGestureIndex>-1?this.computedGestures[this.currentGestureIndex]:void 0},currentEvent:function(){switch(this.currentGestureIndex){case-2:return"neutral";case-1:return;default:return this.currentGesture.event}},currentEventName:function(){return void 0===this.currentGesture?void 0:this.currentGesture.name},currentInstruction:function(){if("training"===this.state)switch(this.currentGestureIndex){case-2:return this.neutralTrainingPrompt;case-1:return;default:return this.currentGesture.trainingPrompt}else if("testing"===this.state)switch(this.currentGestureIndex){case-2:return this.neutralVerificationPrompt;case-1:return;default:return this.currentGesture.verificationPrompt}},showCameraFeed:function(){switch(this.state){case"training":return this.showCameraFeedDuringTraining;case"testing":return this.showCameraFeedDuringVerification;default:return this.showCameraFeedAfterTrainingCycle}},showProgressBar:function(){return-1!==this.currentGestureIndex&&!this.preparing}},mounted:async function(){this.knn=r(),this.mobilenet=await p(),this.busyLoadingMobilenet=!1,this.mediaStream=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),this.$refs.video.srcObject=this.mediaStream,this.$refs.video.play(),this.animationFrameId=requestAnimationFrame(this.animate),this.updateState()},unmounted:function(){this.knn&&this.knn.dispose(),this.mediaStream&&this.mediaStream.getTracks().forEach((e=>e.stop()))},methods:{async animate(){if(this.videoPlaying){const e=t.fromPixels(this.$refs.video);switch(this.state){case"training":this.trainFrame(e);break;case"testing":this.testFrame(e);break;case"predicting":this.predictFrame(e)}e.dispose()}this.animationFrameId=requestAnimationFrame(this.animate)},trainFrame(e){if(-1!==this.currentGestureIndex&&!this.preparing){const t=this.classIndexFromGestureIndex(this.currentGestureIndex),i=this.mobilenet.infer(e,"conv_preds");this.knn.addExample(i,t),i.dispose()}},async testFrame(e){if(-1!==this.currentGestureIndex&&!this.preparing){const t=this.mobilenet.infer(e,"conv_preds"),i=await this.knn.predictClass(t,10);this.gestureIndexFromClassIndex(i.classIndex)===this.currentGestureIndex?this.gestureVerifyingCorrectSamples++:this.gestureVerifyingIncorrectSamples++,t.dispose()}},async predictFrame(e){const t=this.mobilenet.infer(e,"conv_preds"),i=await this.knn.predictClass(t,10),r=parseInt(i.label),s=this.gestureIndexFromClassIndex(r),n=-2===s,a=n?void 0:this.computedGestures[s],o=n?"neutral":this.computedGestures[s].event,u=n?this.fireOnce:a.fireOnce,d=n?this.throttleEvents:a.throttleEvent,c=this.lastGestureIndexDetected;if(this.lastGestureIndexDetected=s,s!==c)this.$emit(o),this.lastGestureDetectedTime=(new Date).getTime();else if(!u)if(d>0){const e=(new Date).getTime();e-this.lastGestureDetectedTime>=d&&(this.$emit(o),this.lastGestureDetectedTime=e)}else this.$emit(o);t.dispose()},updateState(){if(this.model)return this.loadModelFromJson(this.model),this.state="predicting",void(this.currentGestureIndex=-1);if(this.preparing)return this.preparing=!1,this.scheduleUpdateState(),void requestAnimationFrame(this.updateProgress);if("testing"===this.state){if(100*(this.gestureVerifyingCorrectSamples+0)/(this.gestureVerifyingCorrectSamples+this.gestureVerifyingIncorrectSamples)<(-2===this.currentGestureIndex?this.requiredAccuracy:this.currentGesture.requiredAccuracy))return this.verifyingRetried?(this.getModelJson().then((e=>this.$emit("verification-failed",e))),void this.reset()):(this.verifyingRetried=!0,this.preparing=!0,this.gestureVerifyingIncorrectSamples=this.gestureVerifyingCorrectSamples=0,void this.scheduleUpdateState());this.verifyingRetried=!1,this.gestureVerifyingIncorrectSamples=this.gestureVerifyingCorrectSamples=0}const e=this.currentGestureIndex===this.computedGestures.length-1;return-1===this.currentGestureIndex&&!this.trainNeutralLast||e&&this.trainNeutralLast?(this.currentGestureIndex=-2,this.preparing=!0,void this.scheduleUpdateState()):-2===this.currentGestureIndex&&this.trainNeutralLast||e?("training"===this.state&&this.doVerification?(this.getModelJson().then((e=>this.$emit("done-training",e))),this.state="testing",this.currentGestureIndex=this.trainNeutralLast?0:-2,this.preparing=!0):("testing"===this.state&&this.getModelJson().then((e=>this.$emit("done-verification",e))),this.state="predicting",this.currentGestureIndex=-1),void this.scheduleUpdateState()):(this.currentGestureIndex=-2===this.currentGestureIndex?0:this.currentGestureIndex+1,this.preparing=!0,void this.scheduleUpdateState())},scheduleUpdateState(){let e;if("training"===this.state)if(-2===this.currentGestureIndex)e=this.preparing?this.trainingDelay:this.trainingTime;else{if(!(this.currentGestureIndex>-1))return;e=this.preparing?this.currentGesture.trainingDelay:this.currentGesture.trainingTime}else{if("testing"!==this.state)return;if(-2===this.currentGestureIndex)e=this.preparing?this.verificationDelay:this.verificationTime;else{if(!(this.currentGestureIndex>-1))return;e=this.preparing?this.currentGesture.verificationDelay:this.currentGesture.verificationTime}}this.timeStartedWaiting=(new Date).getTime(),this.timeToFinishWaiting=this.timeStartedWaiting+e,this.updateStateTimeoutId=setTimeout(this.updateState,e)},updateProgress(){const e=this.timeToFinishWaiting-this.timeStartedWaiting,t=(new Date).getTime()-this.timeStartedWaiting;this.progress=t>e?1:t/e,this.showProgressBar&&requestAnimationFrame(this.updateProgress)},reset(){this.knn.clearAllClasses(),this.state="training",this.preparing=!1,this.currentGestureIndex=-1,this.verifyingRetried=!1,clearTimeout(this.updateStateTimeoutId),this.updateState()},classIndexFromGestureIndex(e){return this.trainNeutralLast?-2===e?this.computedGestures.length:e:-2===e?0:e+1},gestureIndexFromClassIndex(e){return this.trainNeutralLast?e===this.computedGestures.length?-2:e:0===e?-2:e-1},async getModelJson(){const e=this.knn.getClassifierDataset(),t=[];for(const i in e)t.push({label:i,values:Array.from(await e[i].data()),shape:e[i].shape});return JSON.stringify(t)},loadModelFromJson(e){const t=JSON.parse(e),r={};t.forEach((e=>{r[e.label]=i(e.values,e.shape)})),this.knn.setClassifierDataset(r)}}},v=g("data-v-51aace96");s("data-v-51aace96");const y={class:"camera-gestures-container"},G={key:0,class:"camera-gestures-loader-container"},w=h("div",{class:"camera-gestures-lds-ring"},[h("div"),h("div"),h("div"),h("div")],-1);n();const I=v(((e,t,i,r,s,n)=>(a(),o("div",y,[u(e.$slots,"loading",{loading:e.busyLoadingMobilenet},(()=>[e.busyLoadingMobilenet?(a(),o("div",G,[w])):d("",!0)])),c(h("video",{ref:"video",autoplay:"",playsinline:"",class:"camera-gestures-camera-feed",onPlaying:t[1]||(t[1]=t=>e.videoPlaying=!0),onPause:t[2]||(t[2]=t=>e.videoPlaying=!1)},null,544),[[l,!e.busyLoadingMobilenet&&n.showCameraFeed]]),u(e.$slots,"progress",{inProgress:n.showProgressBar,progress:e.progress},(()=>[h("div",{style:{width:227*e.progress+"px"},class:[{invisible:!n.showProgressBar},"camera-gestures-progress-bar"]},null,6)])),u(e.$slots,"instructions",{training:"training"===e.state,verifying:"testing"===e.state,event:n.currentEvent,eventName:n.currentEventName},(()=>[c(h("p",{class:"camera-gestures-instructions"},m(n.currentInstruction),513),[[l,n.currentInstruction]])]))]))));function x(e){x.installed||(x.installed=!0,e.component("CameraGestures",f))}f.render=I,f.__scopeId="data-v-51aace96";const P={install:x};let b=null;"undefined"!=typeof window?b=window.Vue:"undefined"!=typeof global&&(b=global.Vue),b&&b.use(P);export default f;export{x as install,p as loadMobilenet};
