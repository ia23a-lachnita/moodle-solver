// Moodle Quiz Solver - Background Service Worker

var d={CONFIG:"quiz_solver_config",CACHE:"quiz_solver_cache"};chrome.runtime.onMessage.addListener((e,n,r)=>{let{type:i,payload:s}=e;switch(i){case"CHECK_API_KEY":return h(s.config).then(t=>r({success:!0,result:t})).catch(t=>r({success:!1,error:t.message})),!0;case"GET_MODELS":return y(s.config).then(t=>r({success:!0,result:t})).catch(t=>r({success:!1,error:t.message})),!0;case"GET_ANSWER":return b(s.request,s.config).then(t=>r({success:!0,result:t})).catch(t=>r({success:!1,error:t.message})),!0;case"GET_CONFIG":return w().then(t=>r({success:!0,config:t})).catch(t=>r({success:!1,error:t.message})),!0;case"SET_CONFIG":return x(s.config).then(()=>r({success:!0})).catch(t=>r({success:!1,error:t.message})),!0;default:return r({success:!1,error:"Unknown message type"}),!1}});function p(e){let n={"Content-Type":"application/json"};return e.apiKey&&(e.provider==="anthropic"?(n["x-api-key"]=e.apiKey,n["anthropic-version"]="2023-06-01"):n.Authorization=`Bearer ${e.apiKey}`),e.provider==="openrouter"&&(n["HTTP-Referer"]="chrome-extension://moodle-quiz-solver",n["X-Title"]="Moodle Quiz Solver"),e.extraHeaders&&Object.assign(n,e.extraHeaders),n}function g(e,n){let r=`You are an AI assistant that solves Moodle quiz questions. You must output a JSON object with answers for each field in the question.

CRITICAL: Output ONLY valid JSON matching this schema:
{
  "answer": { "field_id": "value" },
  "explanation": "brief explanation",
  "confidence": 0.95
}

Field types and expected value formats:
- text: string
- numeric: { "value": "123", "unit_option_id": "optional_unit_id" }
- single_choice: { "option_id": "option_id" }
- multiple_choice: { "option_ids": ["id1", "id2"] }
- ordering: { "item_ids": ["id1", "id2", ...] }
- markers: { "points": [{ "x": 100, "y": 200 }] }
- essay: { "value": "HTML or plain text response" }

Rules:
1. Answer ALL fields present in the question
2. Use exact field_ids and option_ids from the question
3. For multiple_choice, select ALL correct options
4. For ordering, provide ALL items in correct order
5. Confidence: 0.0-1.0
6. No extra commentary, ONLY the JSON`,i=`${e.context?`Context: ${e.context}

`:""}Question (${e.question.qtype}):
${JSON.stringify(e.question,null,2)}

Provide answers as JSON.`;return[{role:"system",content:r},{role:"user",content:i}]}async function f(e,n,r){let i=`${e.baseUrl.replace(/\/$/,"")}/chat/completions`,s=p(e),t={model:e.model,messages:n,temperature:e.temperature??.1,max_tokens:e.maxTokens??4e3,response_format:{type:"json_object"}};e.provider==="openrouter"&&e.reasoning&&(t.reasoning={effort:e.reasoning}),e.provider==="anthropic"&&(delete t.response_format,t.tools=[{name:"submit_answer",description:"Submit the structured answer",input_schema:{type:"object",properties:{answer:{type:"object"},explanation:{type:"string"},confidence:{type:"number",minimum:0,maximum:1}},required:["answer","explanation","confidence"]}}],t.tool_choice={type:"tool",name:"submit_answer"});let o=await fetch(i,{method:"POST",headers:s,body:JSON.stringify(t),signal:r});if(!o.ok){let l=`HTTP ${o.status}: ${o.statusText}`;try{let u=await o.json();l=u.error?.message||u.message||l}catch{}throw new Error(l)}let a=await o.json(),c,m=a.usage;if(e.provider==="anthropic"){let l=a.content?.find(u=>u.type==="tool_use");l?.name==="submit_answer"?c=JSON.stringify(l.input):c=a.content?.[0]?.text||"{}"}else c=a.choices?.[0]?.message?.content||"{}";return{content:c,usage:m}}async function h(e){try{let n=`${e.baseUrl.replace(/\/$/,"")}/models`,r=p(e),i=await fetch(n,{headers:r});if(!i.ok)return{valid:!1};let s=await i.json();return{valid:!0,models:s.data?.map(o=>o.id)||s.models?.map(o=>o.id)||[]}}catch{return{valid:!1}}}async function y(e){let n=`${e.baseUrl.replace(/\/$/,"")}/models`,r=p(e),i=await fetch(n,{headers:r});if(!i.ok)throw new Error(`Failed to fetch models: ${i.status}`);let s=await i.json();return{models:(s.data||s.models||[]).map(o=>({id:o.id,name:o.name||o.id,is_default:o.id===e.model}))}}async function b(e,n){let r=new AbortController,i=setTimeout(()=>r.abort(),6e4);try{let s=g(e,n),{content:t,usage:o}=await f(n,s,r.signal),a;try{a=JSON.parse(t)}catch{throw new Error("AI returned invalid JSON. Try a different model or adjust temperature.")}if(!a.answer||typeof a.answer!="object")throw new Error('AI response missing "answer" object');return{answer:a.answer,explanation:a.explanation,confidence:a.confidence,usage:o}}finally{clearTimeout(i)}}async function w(){return(await chrome.storage.local.get(d.CONFIG))[d.CONFIG]||null}async function x(e){await chrome.storage.local.set({[d.CONFIG]:e})}chrome.runtime.onSuspend?.addListener(()=>{});
//# sourceMappingURL=background.js.map
