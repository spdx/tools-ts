/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-spdx",
factory: function (require) {
var plugin=(()=>{var ht=Object.create;var z=Object.defineProperty;var Dt=Object.getOwnPropertyDescriptor;var xt=Object.getOwnPropertyNames;var Et=Object.getPrototypeOf,It=Object.prototype.hasOwnProperty;var l=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var p=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),K=(e,t)=>{for(var r in t)z(e,r,{get:t[r],enumerable:!0})},Fe=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of xt(t))!It.call(e,i)&&i!==r&&z(e,i,{get:()=>t[i],enumerable:!(n=Dt(t,i))||n.enumerable});return e};var Le=(e,t,r)=>(r=e!=null?ht(Et(e)):{},Fe(t||!e||!e.__esModule?z(r,"default",{value:e,enumerable:!0}):r,e)),Pt=e=>Fe(z({},"__esModule",{value:!0}),e);var Ie=p(Ee=>{"use strict";Object.defineProperty(Ee,"__esModule",{value:!0});Ee.default=Ot;var _t=St(l("crypto"));function St(e){return e&&e.__esModule?e:{default:e}}var $=new Uint8Array(256),W=$.length;function Ot(){return W>$.length-16&&(_t.default.randomFillSync($),W=0),$.slice(W,W+=16)}});var we=p(Q=>{"use strict";Object.defineProperty(Q,"__esModule",{value:!0});Q.default=void 0;var vt=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;Q.default=vt});var b=p(Z=>{"use strict";Object.defineProperty(Z,"__esModule",{value:!0});Z.default=void 0;var Ct=At(we());function At(e){return e&&e.__esModule?e:{default:e}}function kt(e){return typeof e=="string"&&Ct.default.test(e)}var Nt=kt;Z.default=Nt});var q=p(B=>{"use strict";Object.defineProperty(B,"__esModule",{value:!0});B.default=void 0;B.unsafeStringify=Me;var yt=Rt(b());function Rt(e){return e&&e.__esModule?e:{default:e}}var m=[];for(let e=0;e<256;++e)m.push((e+256).toString(16).slice(1));function Me(e,t=0){return m[e[t+0]]+m[e[t+1]]+m[e[t+2]]+m[e[t+3]]+"-"+m[e[t+4]]+m[e[t+5]]+"-"+m[e[t+6]]+m[e[t+7]]+"-"+m[e[t+8]]+m[e[t+9]]+"-"+m[e[t+10]]+m[e[t+11]]+m[e[t+12]]+m[e[t+13]]+m[e[t+14]]+m[e[t+15]]}function Ft(e,t=0){let r=Me(e,t);if(!(0,yt.default)(r))throw TypeError("Stringified UUID is invalid");return r}var Lt=Ft;B.default=Lt});var Ue=p(ee=>{"use strict";Object.defineProperty(ee,"__esModule",{value:!0});ee.default=void 0;var Tt=Mt(Ie()),wt=q();function Mt(e){return e&&e.__esModule?e:{default:e}}var Ve,Pe,_e=0,Se=0;function Vt(e,t,r){let n=t&&r||0,i=t||new Array(16);e=e||{};let o=e.node||Ve,a=e.clockseq!==void 0?e.clockseq:Pe;if(o==null||a==null){let u=e.random||(e.rng||Tt.default)();o==null&&(o=Ve=[u[0]|1,u[1],u[2],u[3],u[4],u[5]]),a==null&&(a=Pe=(u[6]<<8|u[7])&16383)}let s=e.msecs!==void 0?e.msecs:Date.now(),d=e.nsecs!==void 0?e.nsecs:Se+1,c=s-_e+(d-Se)/1e4;if(c<0&&e.clockseq===void 0&&(a=a+1&16383),(c<0||s>_e)&&e.nsecs===void 0&&(d=0),d>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");_e=s,Se=d,Pe=a,s+=122192928e5;let f=((s&268435455)*1e4+d)%4294967296;i[n++]=f>>>24&255,i[n++]=f>>>16&255,i[n++]=f>>>8&255,i[n++]=f&255;let D=s/4294967296*1e4&268435455;i[n++]=D>>>8&255,i[n++]=D&255,i[n++]=D>>>24&15|16,i[n++]=D>>>16&255,i[n++]=a>>>8|128,i[n++]=a&255;for(let u=0;u<6;++u)i[n+u]=o[u];return t||(0,wt.unsafeStringify)(i)}var Ut=Vt;ee.default=Ut});var Oe=p(te=>{"use strict";Object.defineProperty(te,"__esModule",{value:!0});te.default=void 0;var bt=Bt(b());function Bt(e){return e&&e.__esModule?e:{default:e}}function qt(e){if(!(0,bt.default)(e))throw TypeError("Invalid UUID");let t,r=new Uint8Array(16);return r[0]=(t=parseInt(e.slice(0,8),16))>>>24,r[1]=t>>>16&255,r[2]=t>>>8&255,r[3]=t&255,r[4]=(t=parseInt(e.slice(9,13),16))>>>8,r[5]=t&255,r[6]=(t=parseInt(e.slice(14,18),16))>>>8,r[7]=t&255,r[8]=(t=parseInt(e.slice(19,23),16))>>>8,r[9]=t&255,r[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,r[11]=t/4294967296&255,r[12]=t>>>24&255,r[13]=t>>>16&255,r[14]=t>>>8&255,r[15]=t&255,r}var Ht=qt;te.default=Ht});var ve=p(S=>{"use strict";Object.defineProperty(S,"__esModule",{value:!0});S.URL=S.DNS=void 0;S.default=Kt;var Yt=q(),Jt=Xt(Oe());function Xt(e){return e&&e.__esModule?e:{default:e}}function zt(e){e=unescape(encodeURIComponent(e));let t=[];for(let r=0;r<e.length;++r)t.push(e.charCodeAt(r));return t}var be="6ba7b810-9dad-11d1-80b4-00c04fd430c8";S.DNS=be;var Be="6ba7b811-9dad-11d1-80b4-00c04fd430c8";S.URL=Be;function Kt(e,t,r){function n(i,o,a,s){var d;if(typeof i=="string"&&(i=zt(i)),typeof o=="string"&&(o=(0,Jt.default)(o)),((d=o)===null||d===void 0?void 0:d.length)!==16)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let c=new Uint8Array(16+i.length);if(c.set(o),c.set(i,o.length),c=r(c),c[6]=c[6]&15|t,c[8]=c[8]&63|128,a){s=s||0;for(let f=0;f<16;++f)a[s+f]=c[f];return a}return(0,Yt.unsafeStringify)(c)}try{n.name=e}catch{}return n.DNS=be,n.URL=Be,n}});var qe=p(re=>{"use strict";Object.defineProperty(re,"__esModule",{value:!0});re.default=void 0;var jt=Gt(l("crypto"));function Gt(e){return e&&e.__esModule?e:{default:e}}function Wt(e){return Array.isArray(e)?e=Buffer.from(e):typeof e=="string"&&(e=Buffer.from(e,"utf8")),jt.default.createHash("md5").update(e).digest()}var $t=Wt;re.default=$t});var Ye=p(ne=>{"use strict";Object.defineProperty(ne,"__esModule",{value:!0});ne.default=void 0;var Qt=He(ve()),Zt=He(qe());function He(e){return e&&e.__esModule?e:{default:e}}var er=(0,Qt.default)("v3",48,Zt.default),tr=er;ne.default=tr});var Je=p(ie=>{"use strict";Object.defineProperty(ie,"__esModule",{value:!0});ie.default=void 0;var rr=nr(l("crypto"));function nr(e){return e&&e.__esModule?e:{default:e}}var ir={randomUUID:rr.default.randomUUID};ie.default=ir});var Ke=p(se=>{"use strict";Object.defineProperty(se,"__esModule",{value:!0});se.default=void 0;var Xe=ze(Je()),sr=ze(Ie()),or=q();function ze(e){return e&&e.__esModule?e:{default:e}}function ar(e,t,r){if(Xe.default.randomUUID&&!t&&!e)return Xe.default.randomUUID();e=e||{};let n=e.random||(e.rng||sr.default)();if(n[6]=n[6]&15|64,n[8]=n[8]&63|128,t){r=r||0;for(let i=0;i<16;++i)t[r+i]=n[i];return t}return(0,or.unsafeStringify)(n)}var cr=ar;se.default=cr});var je=p(oe=>{"use strict";Object.defineProperty(oe,"__esModule",{value:!0});oe.default=void 0;var dr=ur(l("crypto"));function ur(e){return e&&e.__esModule?e:{default:e}}function fr(e){return Array.isArray(e)?e=Buffer.from(e):typeof e=="string"&&(e=Buffer.from(e,"utf8")),dr.default.createHash("sha1").update(e).digest()}var lr=fr;oe.default=lr});var We=p(ae=>{"use strict";Object.defineProperty(ae,"__esModule",{value:!0});ae.default=void 0;var mr=Ge(ve()),pr=Ge(je());function Ge(e){return e&&e.__esModule?e:{default:e}}var gr=(0,mr.default)("v5",80,pr.default),hr=gr;ae.default=hr});var $e=p(ce=>{"use strict";Object.defineProperty(ce,"__esModule",{value:!0});ce.default=void 0;var Dr="00000000-0000-0000-0000-000000000000";ce.default=Dr});var Qe=p(de=>{"use strict";Object.defineProperty(de,"__esModule",{value:!0});de.default=void 0;var xr=Er(b());function Er(e){return e&&e.__esModule?e:{default:e}}function Ir(e){if(!(0,xr.default)(e))throw TypeError("Invalid UUID");return parseInt(e.slice(14,15),16)}var Pr=Ir;de.default=Pr});var Ze=p(g=>{"use strict";Object.defineProperty(g,"__esModule",{value:!0});Object.defineProperty(g,"NIL",{enumerable:!0,get:function(){return Cr.default}});Object.defineProperty(g,"parse",{enumerable:!0,get:function(){return yr.default}});Object.defineProperty(g,"stringify",{enumerable:!0,get:function(){return Nr.default}});Object.defineProperty(g,"v1",{enumerable:!0,get:function(){return _r.default}});Object.defineProperty(g,"v3",{enumerable:!0,get:function(){return Sr.default}});Object.defineProperty(g,"v4",{enumerable:!0,get:function(){return Or.default}});Object.defineProperty(g,"v5",{enumerable:!0,get:function(){return vr.default}});Object.defineProperty(g,"validate",{enumerable:!0,get:function(){return kr.default}});Object.defineProperty(g,"version",{enumerable:!0,get:function(){return Ar.default}});var _r=P(Ue()),Sr=P(Ye()),Or=P(Ke()),vr=P(We()),Cr=P($e()),Ar=P(Qe()),kr=P(b()),Nr=P(q()),yr=P(Oe());function P(e){return e&&e.__esModule?e:{default:e}}});var en={};K(en,{default:()=>Zr});var he=l("@yarnpkg/cli"),De=l("@yarnpkg/core");var Te=(n=>(n.Person="Person",n.Organization="Organization",n.Tool="Tool",n))(Te||{}),I=class{type;name;email;constructor(t,r,n){this.name=t,this.email=n??void 0,this.type=r}static fromCreator(t){let r=Te[t.type];if(!r)throw new Error("Invalid actor type: "+t.type);return new I(t.name,r,t.email)}static tools(){return new I("SPDX Tools TS","Tool")}toString(){return this.type.valueOf()+": "+this.name+(this.email?" ("+this.email+")":"")}};var j=class{spdxElementId;relatedSpdxElementId;relationshipType;comment;constructor(t,r,n,i){this.spdxElementId=t,this.relatedSpdxElementId=r,this.relationshipType=n,this.comment=i?.comment}};var G=class{toString(){return"NOASSERTION"}};var x=Le(Ze(),1),_n=x.default.v1,Sn=x.default.v3,C=x.default.v4,On=x.default.v5,vn=x.default.NIL,Cn=x.default.version,An=x.default.validate,kn=x.default.stringify,Nn=x.default.parse;var ue=class{name;downloadLocation;spdxId;version;fileName;supplier;originator;filesAnalyzed;verificationCode;checksums;homepage;sourceInfo;licenseConcluded;licenseInfoFromFiles;licenseDeclared;licenseComment;copyrightText;summary;description;comment;externalReferences;attributionTexts;primaryPackagePurpose;releaseDate;builtDate;validUntilDate;constructor(t,r){this.name=t,this.downloadLocation=r?.downloadLocation??new G,this.spdxId=r?.spdxId??"SPDXRef-"+C(),this.version=r?.version??void 0,this.fileName=r?.fileName??void 0,this.supplier=r?.supplier??void 0,this.originator=r?.originator??void 0,this.filesAnalyzed=r?.filesAnalyzed??!1,this.verificationCode=r?.verificationCode??void 0,this.checksums=r?.checksums??[],this.homepage=r?.homepage??void 0,this.sourceInfo=r?.sourceInfo??void 0,this.licenseConcluded=r?.licenseConcluded??void 0,this.licenseInfoFromFiles=r?.licenseInfoFromFiles??[],this.licenseDeclared=r?.licenseDeclared??void 0,this.licenseComment=r?.licenseComment??void 0,this.copyrightText=r?.copyrightText??void 0,this.summary=r?.summary??void 0,this.description=r?.description??void 0,this.comment=r?.comment??void 0,this.externalReferences=r?.externalReferences??[],this.attributionTexts=r?.attributionTexts??[],this.primaryPackagePurpose=r?.primaryPackagePurpose??void 0,this.releaseDate=r?.releaseDate??void 0,this.builtDate=r?.builtDate??void 0,this.validUntilDate=r?.validUntilDate??void 0}};function et(e){return e.toISOString().split(".")[0]+"Z"}var A=class{created;creators;comment;licenseListVersion;constructor(t,r,n,i){this.created=t,this.creators=r,this.comment=n,this.licenseListVersion=i}static fromDocument(t){return new A(et(t.creationInfo.created),t.creationInfo.creators.map(r=>r.toString()),t.creationInfo.creatorComment??void 0,t.creationInfo.licenseListVersion??void 0)}};var E=class{algorithm;checksumValue;constructor(t,r){this.algorithm=t,this.checksumValue=r}static fromChecksum(t){return new E(t.algorithm,t.value)}};var k=class{packageVerificationCodeValue;packageVerificationCodeExcludedFiles;constructor(t,r){this.packageVerificationCodeValue=t,this.packageVerificationCodeExcludedFiles=r}static fromPackageVerificationCode(t){return new k(t.value,t.excludedFiles)}};var N=class{name;downloadLocation;SPDXID;filesAnalyzed;packageVerificationCode;checksums;licenseInfoFromFiles;externalRefs;attributionTexts;constructor(t,r,n,i,o,a,s,d,c){this.name=t,this.downloadLocation=r,this.SPDXID=n,this.filesAnalyzed=i,this.packageVerificationCode=c,this.checksums=o,this.licenseInfoFromFiles=a,this.externalRefs=s,this.attributionTexts=d}static fromPackage(t){let r=t.checksums.length>0?t.checksums.map(i=>E.fromChecksum(i)):void 0,n=t.verificationCode?k.fromPackageVerificationCode(t.verificationCode):void 0;return new N(t.name,t.downloadLocation.toString(),t.spdxId,t.filesAnalyzed,r,void 0,void 0,void 0,n)}};var y=class{spdxElementId;relatedSpdxElement;relationshipType;comment;constructor(t,r,n,i){this.spdxElementId=t,this.comment=i,this.relatedSpdxElement=r,this.relationshipType=n}static fromRelationship(t){return new y(t.spdxElementId,t.relatedSpdxElementId,t.relationshipType)}};var R=class{checksum;externalDocumentId;spdxDocument;constructor(t,r,n){this.checksum=t,this.externalDocumentId=r,this.spdxDocument=n}static fromExternalDocumentRef(t){let r=E.fromChecksum(t.checksum);return new R(r,t.documentRefId,t.documentUri)}};var F=class{SPDXID;fileName;checksums;fileTypes;constructor(t,r,n,i){this.SPDXID=t,this.fileName=r,this.checksums=n,this.fileTypes=i}static fromFile(t){let r=t.checksums.map(n=>E.fromChecksum(n));return new F(t.spdxId,t.name,r,t.fileTypes)}};var L=class{SPDXID;comment;creationInfo;dataLicense;externalDocumentRefs;name;spdxVersion;documentNamespace;packages;files;relationships;constructor(t,r,n,i,o,a,s,d,c,f,D){this.SPDXID=t,this.spdxVersion=r,this.name=n,this.documentNamespace=i,this.dataLicense=o,this.creationInfo=a,this.packages=s,this.files=d,this.relationships=c,this.externalDocumentRefs=f,this.comment=D}static fromDocument(t){let r=A.fromDocument(t),n=t.packages.length>0?t.packages.map(s=>N.fromPackage(s)):void 0,i=t.files.length>0?t.files.map(s=>F.fromFile(s)):void 0,o=t.relationships.length>0?t.relationships.map(s=>y.fromRelationship(s)):void 0,a=t.creationInfo.externalDocumentRefs?.length>0?t.creationInfo.externalDocumentRefs.map(s=>R.fromExternalDocumentRef(s)):void 0;return new L(t.creationInfo.spdxId,t.creationInfo.spdxVersion,t.creationInfo.name,t.creationInfo.documentNamespace,t.creationInfo.dataLicense,r,n,i,o,a,t.creationInfo.documentComment)}};var tt=Le(l("fs/promises"),1),H=class{creationInfo;packages;files;snippets;annotations;relationships;otherLicensingInfo;constructor(t,r){this.creationInfo=t,this.packages=r?.packages??[],this.files=r?.files??[],this.snippets=r?.snippets??[],this.annotations=r?.annotations??[],this.relationships=r?.relationships??[],this.otherLicensingInfo=r?.otherLicensingInfo??[]}hasMissingDescribesRelationships(){let t=this.packages.length===1&&this.files.length===0&&this.snippets.length===0,r=this.relationships.filter(i=>i.relationshipType==="DESCRIBES"),n=this.relationships.filter(i=>i.relationshipType==="DESCRIBED_BY");return!(t||r.length>0||n.length>0)}hasDuplicateSpdxIds(){let t=[];return this.packages.forEach(r=>{if(t.includes(r.spdxId))return!0;t.push(r.spdxId)}),this.relationships.forEach(r=>{if(t.includes(r.spdxElementId))return!0;t.push(r.spdxElementId)}),!1}validate(){let t=[];return this.creationInfo.spdxVersion!=="SPDX-2.3"&&t.concat("Invalid SPDX version. Currently only SPDX-2.3 is supported."),this.hasMissingDescribesRelationships()&&t.concat("Missing DESCRIBES or DESCRIBED_BY relationships.","Document must have at least one DESCRIBES and one DESCRIBED_BY relationship, if there is not exactly one package present."),this.hasDuplicateSpdxIds()&&t.concat("Duplicate SPDX IDs for packages, files, snippets or relationships."),t}async writeFile(t){let r=L.fromDocument(this),n=JSON.stringify(r,null,2);await tt.default.writeFile(t,n)}};var fe=class{spdxVersion;dataLicense="CC0-1.0";spdxId;name;documentNamespace;externalDocumentRefs;licenseListVersion;creators;created;creatorComment;documentComment;constructor(t,r,n,i,o,a){this.spdxVersion=t,this.name=r,this.documentNamespace=n,this.creators=i,this.created=o,this.externalDocumentRefs=a?.externalDocumentRefs??[],this.creatorComment=a?.creatorComment??void 0,this.licenseListVersion=a?.licenseListVersion??void 0,this.documentComment=a?.documentComment??void 0,this.spdxId=a?.spdxId??"SPDXRef-DOCUMENT"}};var le=class{documentRefId;documentUri;checksum;constructor(t,r,n){this.documentRefId=t,this.documentUri=r,this.checksum=n}};var T=class{algorithm;value;constructor(t,r){this.algorithm=t,this.value=r}};var me=class{name;spdxId;checksums;fileTypes;constructor(t,r,n){this.name=t,this.spdxId="SPDXRef-"+C(),this.checksums=r,this.fileTypes=n?.fileTypes??[]}};var w=class extends H{static formatCreators(t){return t?Array.isArray(t)?t.map(r=>I.fromCreator(r)):[I.fromCreator(t)]:[]}static formatSpdxVersion(t){return"SPDX-"+(t??"2.3")}static generateNamespace(t){return"urn:"+(t.replace(/^[^A-Za-z0-9]+/,"").replace(/[^A-Za-z0-9-]/g,"-")??"document")+":"+C()}static formatExternalDocumentRefs(t){return t?t.map(r=>new le(r.documentRefId,r.documentUri,new T(r.checksum_algorithm,r.checksum_value))):void 0}static createDocument(t,r){let n=new fe(this.formatSpdxVersion(r?.spdxVersion),t,r?.namespace??this.generateNamespace(t),this.formatCreators(r?.creators).concat(I.tools()),r?.created??new Date,{...r,externalDocumentRefs:this.formatExternalDocumentRefs(r?.externalDocumentRefs)});return new w(n)}addPackage(t,r){let n=new ue(t,r);return this.packages=this.packages.concat(n),n}addFile(t,r,n){let i=Array.isArray(r)?r.map(s=>new T(s.checksumAlgorithm,s.checksumValue)):[new T(r.checksumAlgorithm,r.checksumValue)],o=n?.fileTypes?n.fileTypes.map(s=>s):void 0,a=new me(t,i,{spdxId:n?.spdxId??void 0,fileTypes:o});return this.files=this.files.concat(a),a}addRelationship(t,r,n,i){function o(s){return typeof s=="string"?s:s instanceof H?s.creationInfo.spdxId:s.spdxId}let a=new j(o(t),o(r),n,{comment:i?.comment});return this.relationships=this.relationships.concat(a),this}async write(t,r=!1){let n=this.validate();n.length>0&&(console.error(`Document is invalid: ${n.join(`
`)}`),!r)||await this.writeFile(t)}writeSync(t,r=!1){let n=this.validate();if(n.length>0&&!r){console.error(`Document is invalid: ${n.join(`
`)}`);return}this.writeFile(t).then(()=>{console.log("Wrote SBOM successfully: "+t)}).catch(i=>{console.error("Error writing sample SBOM: "+i)})}};function Rr(e){return parseInt(e.split(".")[0])}function rt(e,t){let r=t?.spdxVersion;if(!r||Rr(r)===2)return w.createDocument(e,t);throw new Error("Unsupported SPDX version")}var X=l("clipanion");var h=l("@yarnpkg/core"),nt=async(e,t,r)=>{let n=new Map,i;if(t){if(r){for(let c of e.workspaces)c.manifest.devDependencies.clear();let s=await h.Cache.find(e.configuration),d=new h.ThrowReport;await e.resolveEverything({report:d,cache:s})}i=e.storedDescriptors.values()}else i=e.workspaces.flatMap(s=>{let d=[s.anchoredDescriptor];for(let[c,f]of s.anchoredPackage.dependencies.entries())r&&s.manifest.devDependencies.has(c)||d.push(f);return d});let o=h.miscUtils.sortMap(i,[s=>h.structUtils.stringifyIdent(s),s=>h.structUtils.isVirtualDescriptor(s)?"0":"1",s=>s.range]),a=new Set;for(let s of o.values()){let d=e.storedResolutions.get(s.descriptorHash);if(!d)continue;let c=e.storedPackages.get(d);if(!c)continue;let{descriptorHash:f}=h.structUtils.isVirtualDescriptor(s)?h.structUtils.devirtualizeDescriptor(s):s;a.has(f)||(a.add(f),n.set(s,c))}return n};var Ae={};K(Ae,{fs:()=>wr,getPackagePath:()=>Lr});var it=l("@yarnpkg/plugin-pnp"),pe=l("@yarnpkg/core"),st=l("@yarnpkg/fslib");var M=()=>({os:[process.platform],cpu:[process.arch],libc:[]});var Lr=async(e,t)=>{if(Tr(e),!pe.structUtils.isPackageCompatible(t,M()))return null;let r=pe.structUtils.convertPackageToLocator(t),n={name:pe.structUtils.stringifyIdent(r),reference:r.reference},i=Ce.getPackageInformation(n);if(!i)return null;let{packageLocation:o}=i;return o},Ce,Tr=e=>{Ce||(Ce=module.require((0,it.getPnpPath)(e).cjs))},wr=new st.VirtualFS({});var Y={};K(Y,{_getYarnStateAliases:()=>ct,fs:()=>Ur,getPackagePath:()=>Mr});var O=l("@yarnpkg/core"),ot=l("@yarnpkg/parsers"),_=l("@yarnpkg/fslib");var Mr=async(e,t)=>{if(await Vr(e),!O.structUtils.isPackageCompatible(t,M()))return null;let r=O.structUtils.convertPackageToLocator(t),n=O.structUtils.stringifyLocator(r),i=ge[n]||at[n];if(!i)return null;let o=i.locations[0];return o?_.ppath.join(e.cwd,o):e.cwd},ge,at,Vr=async e=>{if(!ge){let t=_.ppath.join(e.configuration.projectCwd,_.Filename.nodeModules,".yarn-state.yml");ge=(0,ot.parseSyml)(await _.xfs.readFilePromise(t,"utf8")),at=ct(ge)}},Ur=_.xfs,ct=e=>Object.entries(e).reduce((t,[r,n])=>{if(!n.aliases)return t;let i=O.structUtils.parseLocator(r);for(let o of n.aliases){let a=O.structUtils.makeLocator(i,o),s=O.structUtils.stringifyLocator(a);t[s]=n}return t},{});var ke={};K(ke,{fs:()=>Br,getPackagePath:()=>br});var J=l("@yarnpkg/core"),v=l("@yarnpkg/fslib");var br=async(e,t)=>{if(!J.structUtils.isPackageCompatible(t,M()))return null;let r=J.structUtils.convertPackageToLocator(t),n=J.structUtils.slugifyLocator(r),i=J.structUtils.stringifyIdent(r),o=e.tryWorkspaceByLocator(r);return o?o.cwd:v.ppath.join(e.configuration.projectCwd,v.Filename.nodeModules,".store",n,v.Filename.nodeModules,i)},Br=v.xfs;var dt=e=>{switch(e){case"pnp":return Ae;case"node-modules":return Y;case"pnpm":return ke;default:throw new Error("Unsupported linker")}};var xe=l("@yarnpkg/fslib"),qr="NOASSERTION",Hr="SPDXRef-",Yr="DEPENDS_ON",Jr="DESCRIBES",Xr=".spdx.json",ft="(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/|ssh:\\/\\/|git:\\/\\/|svn:\\/\\/|sftp:\\/\\/|ftp:\\/\\/)?([\\w\\-.!~*'()%;:&=+$,]+@)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+){0,100}\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?",zr="(git|hg|svn|bzr)",Kr="(git\\+git@[a-zA-Z0-9\\.\\-]+:[a-zA-Z0-9/\\\\.@\\-]+)",jr="(bzr\\+lp:[a-zA-Z0-9\\.\\-]+)",Gr="^((("+zr+"\\+)?"+ft+")|"+Kr+"|"+jr+")$",V=class extends he.BaseCommand{constructor(){super(...arguments);this.recursive=X.Option.Boolean("-R,--recursive",!0,{description:"Include transitive dependencies (dependencies of direct dependencies)"});this.production=X.Option.Boolean("--production",!0,{description:"Exclude development dependencies"})}async execute(){let r=await De.Configuration.find(this.context.cwd,this.context.plugins),{project:n,workspace:i}=await De.Project.find(r,this.context.cwd);if(!i)throw new he.WorkspaceRequiredError(n.cwd,this.context.cwd);await n.restoreInstallState();let o=rt(i.manifest.name?.name??"spdx"),a=await nt(n,this.recursive,this.production),s=[...a].flatMap(([,D])=>[...D.dependencies].flatMap(([,u])=>u.descriptorHash)),d=n.configuration.get("nodeLinker"),c;typeof d=="string"?c=dt(d):c=Y;let f=new Set;for(let[D,u]of a.entries()){let Ne=await c.getPackagePath(n,u);if(Ne===null)continue;let lt=JSON.parse(await c.fs.readFilePromise(xe.ppath.join(Ne,xe.Filename.manifest),"utf8")),{repository:mt}=lt,pt=Wr(mt),U=ut(u);if(!f.has(U)){f.add(U),o.addPackage(u.name,{downloadLocation:pt,spdxId:U});for(let[,gt]of u.dependencies.entries()){let ye=n.storedResolutions.get(gt.descriptorHash);if(!ye)continue;let Re=n.storedPackages.get(ye);!Re||o.addRelationship(U,ut(Re),Yr)}s.includes(D.descriptorHash)||o.addRelationship(o,U,Jr)}}o.writeSync((i.manifest.name?.name??"")+Xr)}};V.paths=[["spdx"]],V.usage=X.Command.Usage({description:"Generate SPDX document for the project",details:`
        This command generates an SPDX document for the project. By default, the document will be placed in the root of the project.

        If \`-R,--recursive\` is set, the listing will include transitive dependencies (dependencies of direct dependencies).

        If \`--production\` is set, the listing will exclude development dependencies.`,examples:[["Generate SPDX document","$0 spdx"],["Generate SPDX document with only direct dependencies","$0 spdx --recursive false"],["Generate SPDX document with only production dependencies","$0 spdx --production false"]]});function Wr(e){return e&&typeof e=="object"&&$r(e.url)?e.url:qr}function $r(e){return new RegExp(ft).test(e)&&new RegExp(Gr).test(e)}function ut(e){let t=e.name.replace(/^@/,"").replace(/_/g,"-"),r=e.version.replace(/\//g,".").replace(/_/g,"-");return Hr+t+"-"+r}var Qr={commands:[V]},Zr=Qr;return Pt(en);})();
return plugin;
}
};