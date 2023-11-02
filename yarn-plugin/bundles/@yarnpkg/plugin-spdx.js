/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-spdx",
factory: function (require) {
var plugin=(()=>{var It=Object.create;var z=Object.defineProperty;var Pt=Object.getOwnPropertyDescriptor;var _t=Object.getOwnPropertyNames;var St=Object.getPrototypeOf,Ot=Object.prototype.hasOwnProperty;var f=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var p=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),K=(e,t)=>{for(var r in t)z(e,r,{get:t[r],enumerable:!0})},Fe=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of _t(t))!Ot.call(e,i)&&i!==r&&z(e,i,{get:()=>t[i],enumerable:!(n=Pt(t,i))||n.enumerable});return e};var Me=(e,t,r)=>(r=e!=null?It(St(e)):{},Fe(t||!e||!e.__esModule?z(r,"default",{value:e,enumerable:!0}):r,e)),vt=e=>Fe(z({},"__esModule",{value:!0}),e);var Pe=p(Ie=>{"use strict";Object.defineProperty(Ie,"__esModule",{value:!0});Ie.default=Nt;var Ct=At(f("crypto"));function At(e){return e&&e.__esModule?e:{default:e}}var $=new Uint8Array(256),W=$.length;function Nt(){return W>$.length-16&&(Ct.default.randomFillSync($),W=0),$.slice(W,W+=16)}});var we=p(Q=>{"use strict";Object.defineProperty(Q,"__esModule",{value:!0});Q.default=void 0;var kt=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;Q.default=kt});var b=p(Z=>{"use strict";Object.defineProperty(Z,"__esModule",{value:!0});Z.default=void 0;var yt=Rt(we());function Rt(e){return e&&e.__esModule?e:{default:e}}function Lt(e){return typeof e=="string"&&yt.default.test(e)}var Ft=Lt;Z.default=Ft});var q=p(B=>{"use strict";Object.defineProperty(B,"__esModule",{value:!0});B.default=void 0;B.unsafeStringify=Ve;var Mt=Tt(b());function Tt(e){return e&&e.__esModule?e:{default:e}}var m=[];for(let e=0;e<256;++e)m.push((e+256).toString(16).slice(1));function Ve(e,t=0){return m[e[t+0]]+m[e[t+1]]+m[e[t+2]]+m[e[t+3]]+"-"+m[e[t+4]]+m[e[t+5]]+"-"+m[e[t+6]]+m[e[t+7]]+"-"+m[e[t+8]]+m[e[t+9]]+"-"+m[e[t+10]]+m[e[t+11]]+m[e[t+12]]+m[e[t+13]]+m[e[t+14]]+m[e[t+15]]}function wt(e,t=0){let r=Ve(e,t);if(!(0,Mt.default)(r))throw TypeError("Stringified UUID is invalid");return r}var Vt=wt;B.default=Vt});var be=p(ee=>{"use strict";Object.defineProperty(ee,"__esModule",{value:!0});ee.default=void 0;var Ut=Bt(Pe()),bt=q();function Bt(e){return e&&e.__esModule?e:{default:e}}var Ue,_e,Se=0,Oe=0;function qt(e,t,r){let n=t&&r||0,i=t||new Array(16);e=e||{};let o=e.node||Ue,a=e.clockseq!==void 0?e.clockseq:_e;if(o==null||a==null){let l=e.random||(e.rng||Ut.default)();o==null&&(o=Ue=[l[0]|1,l[1],l[2],l[3],l[4],l[5]]),a==null&&(a=_e=(l[6]<<8|l[7])&16383)}let s=e.msecs!==void 0?e.msecs:Date.now(),u=e.nsecs!==void 0?e.nsecs:Oe+1,c=s-Se+(u-Oe)/1e4;if(c<0&&e.clockseq===void 0&&(a=a+1&16383),(c<0||s>Se)&&e.nsecs===void 0&&(u=0),u>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");Se=s,Oe=u,_e=a,s+=122192928e5;let d=((s&268435455)*1e4+u)%4294967296;i[n++]=d>>>24&255,i[n++]=d>>>16&255,i[n++]=d>>>8&255,i[n++]=d&255;let D=s/4294967296*1e4&268435455;i[n++]=D>>>8&255,i[n++]=D&255,i[n++]=D>>>24&15|16,i[n++]=D>>>16&255,i[n++]=a>>>8|128,i[n++]=a&255;for(let l=0;l<6;++l)i[n+l]=o[l];return t||(0,bt.unsafeStringify)(i)}var Ht=qt;ee.default=Ht});var ve=p(te=>{"use strict";Object.defineProperty(te,"__esModule",{value:!0});te.default=void 0;var Yt=Jt(b());function Jt(e){return e&&e.__esModule?e:{default:e}}function Xt(e){if(!(0,Yt.default)(e))throw TypeError("Invalid UUID");let t,r=new Uint8Array(16);return r[0]=(t=parseInt(e.slice(0,8),16))>>>24,r[1]=t>>>16&255,r[2]=t>>>8&255,r[3]=t&255,r[4]=(t=parseInt(e.slice(9,13),16))>>>8,r[5]=t&255,r[6]=(t=parseInt(e.slice(14,18),16))>>>8,r[7]=t&255,r[8]=(t=parseInt(e.slice(19,23),16))>>>8,r[9]=t&255,r[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,r[11]=t/4294967296&255,r[12]=t>>>24&255,r[13]=t>>>16&255,r[14]=t>>>8&255,r[15]=t&255,r}var zt=Xt;te.default=zt});var Ce=p(S=>{"use strict";Object.defineProperty(S,"__esModule",{value:!0});S.URL=S.DNS=void 0;S.default=$t;var Kt=q(),jt=Gt(ve());function Gt(e){return e&&e.__esModule?e:{default:e}}function Wt(e){e=unescape(encodeURIComponent(e));let t=[];for(let r=0;r<e.length;++r)t.push(e.charCodeAt(r));return t}var Be="6ba7b810-9dad-11d1-80b4-00c04fd430c8";S.DNS=Be;var qe="6ba7b811-9dad-11d1-80b4-00c04fd430c8";S.URL=qe;function $t(e,t,r){function n(i,o,a,s){var u;if(typeof i=="string"&&(i=Wt(i)),typeof o=="string"&&(o=(0,jt.default)(o)),((u=o)===null||u===void 0?void 0:u.length)!==16)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let c=new Uint8Array(16+i.length);if(c.set(o),c.set(i,o.length),c=r(c),c[6]=c[6]&15|t,c[8]=c[8]&63|128,a){s=s||0;for(let d=0;d<16;++d)a[s+d]=c[d];return a}return(0,Kt.unsafeStringify)(c)}try{n.name=e}catch{}return n.DNS=Be,n.URL=qe,n}});var He=p(re=>{"use strict";Object.defineProperty(re,"__esModule",{value:!0});re.default=void 0;var Qt=Zt(f("crypto"));function Zt(e){return e&&e.__esModule?e:{default:e}}function er(e){return Array.isArray(e)?e=Buffer.from(e):typeof e=="string"&&(e=Buffer.from(e,"utf8")),Qt.default.createHash("md5").update(e).digest()}var tr=er;re.default=tr});var Je=p(ne=>{"use strict";Object.defineProperty(ne,"__esModule",{value:!0});ne.default=void 0;var rr=Ye(Ce()),nr=Ye(He());function Ye(e){return e&&e.__esModule?e:{default:e}}var ir=(0,rr.default)("v3",48,nr.default),sr=ir;ne.default=sr});var Xe=p(ie=>{"use strict";Object.defineProperty(ie,"__esModule",{value:!0});ie.default=void 0;var or=ar(f("crypto"));function ar(e){return e&&e.__esModule?e:{default:e}}var cr={randomUUID:or.default.randomUUID};ie.default=cr});var je=p(se=>{"use strict";Object.defineProperty(se,"__esModule",{value:!0});se.default=void 0;var ze=Ke(Xe()),ur=Ke(Pe()),dr=q();function Ke(e){return e&&e.__esModule?e:{default:e}}function lr(e,t,r){if(ze.default.randomUUID&&!t&&!e)return ze.default.randomUUID();e=e||{};let n=e.random||(e.rng||ur.default)();if(n[6]=n[6]&15|64,n[8]=n[8]&63|128,t){r=r||0;for(let i=0;i<16;++i)t[r+i]=n[i];return t}return(0,dr.unsafeStringify)(n)}var fr=lr;se.default=fr});var Ge=p(oe=>{"use strict";Object.defineProperty(oe,"__esModule",{value:!0});oe.default=void 0;var mr=pr(f("crypto"));function pr(e){return e&&e.__esModule?e:{default:e}}function gr(e){return Array.isArray(e)?e=Buffer.from(e):typeof e=="string"&&(e=Buffer.from(e,"utf8")),mr.default.createHash("sha1").update(e).digest()}var hr=gr;oe.default=hr});var $e=p(ae=>{"use strict";Object.defineProperty(ae,"__esModule",{value:!0});ae.default=void 0;var Dr=We(Ce()),xr=We(Ge());function We(e){return e&&e.__esModule?e:{default:e}}var Er=(0,Dr.default)("v5",80,xr.default),Ir=Er;ae.default=Ir});var Qe=p(ce=>{"use strict";Object.defineProperty(ce,"__esModule",{value:!0});ce.default=void 0;var Pr="00000000-0000-0000-0000-000000000000";ce.default=Pr});var Ze=p(ue=>{"use strict";Object.defineProperty(ue,"__esModule",{value:!0});ue.default=void 0;var _r=Sr(b());function Sr(e){return e&&e.__esModule?e:{default:e}}function Or(e){if(!(0,_r.default)(e))throw TypeError("Invalid UUID");return parseInt(e.slice(14,15),16)}var vr=Or;ue.default=vr});var et=p(g=>{"use strict";Object.defineProperty(g,"__esModule",{value:!0});Object.defineProperty(g,"NIL",{enumerable:!0,get:function(){return yr.default}});Object.defineProperty(g,"parse",{enumerable:!0,get:function(){return Mr.default}});Object.defineProperty(g,"stringify",{enumerable:!0,get:function(){return Fr.default}});Object.defineProperty(g,"v1",{enumerable:!0,get:function(){return Cr.default}});Object.defineProperty(g,"v3",{enumerable:!0,get:function(){return Ar.default}});Object.defineProperty(g,"v4",{enumerable:!0,get:function(){return Nr.default}});Object.defineProperty(g,"v5",{enumerable:!0,get:function(){return kr.default}});Object.defineProperty(g,"validate",{enumerable:!0,get:function(){return Lr.default}});Object.defineProperty(g,"version",{enumerable:!0,get:function(){return Rr.default}});var Cr=P(be()),Ar=P(Je()),Nr=P(je()),kr=P($e()),yr=P(Qe()),Rr=P(Ze()),Lr=P(b()),Fr=P(q()),Mr=P(ve());function P(e){return e&&e.__esModule?e:{default:e}}});var on={};K(on,{default:()=>sn});var De=f("@yarnpkg/cli"),xe=f("@yarnpkg/core");var Te=(n=>(n.Person="Person",n.Organization="Organization",n.Tool="Tool",n))(Te||{}),I=class{type;name;email;constructor(t,r,n){this.name=t,this.email=n??void 0,this.type=r}static fromCreator(t){let r=Te[t.type];if(!r)throw new Error("Invalid actor type: "+t.type);return new I(t.name,r,t.email)}static tools(){return new I("SPDX Tools TS","Tool")}toString(){return this.type.valueOf()+": "+this.name+(this.email?" ("+this.email+")":"")}};var j=class{spdxElementId;relatedSpdxElementId;relationshipType;comment;constructor(t,r,n,i){this.spdxElementId=t,this.relatedSpdxElementId=r,this.relationshipType=n,this.comment=i?.comment}};var G=class{toString(){return"NOASSERTION"}};var x=Me(et(),1),An=x.default.v1,Nn=x.default.v3,C=x.default.v4,kn=x.default.v5,yn=x.default.NIL,Rn=x.default.version,Ln=x.default.validate,Fn=x.default.stringify,Mn=x.default.parse;var de=class{name;downloadLocation;spdxId;version;fileName;supplier;originator;filesAnalyzed;verificationCode;checksums;homepage;sourceInfo;licenseConcluded;licenseInfoFromFiles;licenseDeclared;licenseComment;copyrightText;summary;description;comment;externalReferences;attributionTexts;primaryPackagePurpose;releaseDate;builtDate;validUntilDate;constructor(t,r){this.name=t,this.downloadLocation=r?.downloadLocation??new G,this.spdxId=r?.spdxId??"SPDXRef-"+C(),this.version=r?.version??void 0,this.fileName=r?.fileName??void 0,this.supplier=r?.supplier??void 0,this.originator=r?.originator??void 0,this.filesAnalyzed=r?.filesAnalyzed??!1,this.verificationCode=r?.verificationCode??void 0,this.checksums=r?.checksums??[],this.homepage=r?.homepage??void 0,this.sourceInfo=r?.sourceInfo??void 0,this.licenseConcluded=r?.licenseConcluded??void 0,this.licenseInfoFromFiles=r?.licenseInfoFromFiles??[],this.licenseDeclared=r?.licenseDeclared??void 0,this.licenseComment=r?.licenseComment??void 0,this.copyrightText=r?.copyrightText??void 0,this.summary=r?.summary??void 0,this.description=r?.description??void 0,this.comment=r?.comment??void 0,this.externalReferences=r?.externalReferences??[],this.attributionTexts=r?.attributionTexts??[],this.primaryPackagePurpose=r?.primaryPackagePurpose??void 0,this.releaseDate=r?.releaseDate??void 0,this.builtDate=r?.builtDate??void 0,this.validUntilDate=r?.validUntilDate??void 0}};function tt(e){return e.toISOString().split(".")[0]+"Z"}var A=class{created;creators;comment;licenseListVersion;constructor(t,r,n,i){this.created=t,this.creators=r,this.comment=n,this.licenseListVersion=i}static fromDocument(t){return new A(tt(t.creationInfo.created),t.creationInfo.creators.map(r=>r.toString()),t.creationInfo.creatorComment??void 0,t.creationInfo.licenseListVersion??void 0)}};var E=class{algorithm;checksumValue;constructor(t,r){this.algorithm=t,this.checksumValue=r}static fromChecksum(t){return new E(t.algorithm,t.value)}};var N=class{packageVerificationCodeValue;packageVerificationCodeExcludedFiles;constructor(t,r){this.packageVerificationCodeValue=t,this.packageVerificationCodeExcludedFiles=r}static fromPackageVerificationCode(t){return new N(t.value,t.excludedFiles)}};var k=class{name;downloadLocation;SPDXID;filesAnalyzed;packageVerificationCode;checksums;licenseInfoFromFiles;externalRefs;attributionTexts;licenseConcluded;constructor(t,r,n,i,o,a,s,u,c,d){this.name=t,this.downloadLocation=r,this.SPDXID=n,this.filesAnalyzed=i,this.packageVerificationCode=c,this.checksums=o,this.licenseInfoFromFiles=a,this.externalRefs=s,this.attributionTexts=u,this.licenseConcluded=d}static fromPackage(t){let r=t.checksums.length>0?t.checksums.map(i=>E.fromChecksum(i)):void 0,n=t.verificationCode?N.fromPackageVerificationCode(t.verificationCode):void 0;return new k(t.name,t.downloadLocation.toString(),t.spdxId,t.filesAnalyzed,r,void 0,void 0,void 0,n,t.licenseConcluded.toString())}};var y=class{spdxElementId;relatedSpdxElement;relationshipType;comment;constructor(t,r,n,i){this.spdxElementId=t,this.comment=i,this.relatedSpdxElement=r,this.relationshipType=n}static fromRelationship(t){return new y(t.spdxElementId,t.relatedSpdxElementId,t.relationshipType)}};var R=class{checksum;externalDocumentId;spdxDocument;constructor(t,r,n){this.checksum=t,this.externalDocumentId=r,this.spdxDocument=n}static fromExternalDocumentRef(t){let r=E.fromChecksum(t.checksum);return new R(r,t.documentRefId,t.documentUri)}};var L=class{SPDXID;fileName;checksums;fileTypes;constructor(t,r,n,i){this.SPDXID=t,this.fileName=r,this.checksums=n,this.fileTypes=i}static fromFile(t){let r=t.checksums.map(n=>E.fromChecksum(n));return new L(t.spdxId,t.name,r,t.fileTypes)}};var F=class{SPDXID;comment;creationInfo;dataLicense;externalDocumentRefs;name;spdxVersion;documentNamespace;packages;files;relationships;constructor(t,r,n,i,o,a,s,u,c,d,D){this.SPDXID=t,this.spdxVersion=r,this.name=n,this.documentNamespace=i,this.dataLicense=o,this.creationInfo=a,this.packages=s,this.files=u,this.relationships=c,this.externalDocumentRefs=d,this.comment=D}static fromDocument(t){let r=A.fromDocument(t),n=t.packages.length>0?t.packages.map(s=>k.fromPackage(s)):void 0,i=t.files.length>0?t.files.map(s=>L.fromFile(s)):void 0,o=t.relationships.length>0?t.relationships.map(s=>y.fromRelationship(s)):void 0,a=t.creationInfo.externalDocumentRefs?.length>0?t.creationInfo.externalDocumentRefs.map(s=>R.fromExternalDocumentRef(s)):void 0;return new F(t.creationInfo.spdxId,t.creationInfo.spdxVersion,t.creationInfo.name,t.creationInfo.documentNamespace,t.creationInfo.dataLicense,r,n,i,o,a,t.creationInfo.documentComment)}};var rt=Me(f("fs/promises"),1),H=class{creationInfo;packages;files;snippets;annotations;relationships;otherLicensingInfo;constructor(t,r){this.creationInfo=t,this.packages=r?.packages??[],this.files=r?.files??[],this.snippets=r?.snippets??[],this.annotations=r?.annotations??[],this.relationships=r?.relationships??[],this.otherLicensingInfo=r?.otherLicensingInfo??[]}hasMissingDescribesRelationships(){let t=this.packages.length===1&&this.files.length===0&&this.snippets.length===0,r=this.relationships.filter(i=>i.relationshipType==="DESCRIBES"),n=this.relationships.filter(i=>i.relationshipType==="DESCRIBED_BY");return!(t||r.length>0||n.length>0)}hasDuplicateSpdxIds(){let t=[];return this.packages.forEach(r=>{if(t.includes(r.spdxId))return!0;t.push(r.spdxId)}),this.relationships.forEach(r=>{if(t.includes(r.spdxElementId))return!0;t.push(r.spdxElementId)}),!1}validate(){let t=[];return this.creationInfo.spdxVersion!=="SPDX-2.3"&&t.concat("Invalid SPDX version. Currently only SPDX-2.3 is supported."),this.hasMissingDescribesRelationships()&&t.concat("Missing DESCRIBES or DESCRIBED_BY relationships.","Document must have at least one DESCRIBES and one DESCRIBED_BY relationship, if there is not exactly one package present."),this.hasDuplicateSpdxIds()&&t.concat("Duplicate SPDX IDs for packages, files, snippets or relationships."),t}async writeFile(t){let r=F.fromDocument(this),n=JSON.stringify(r,null,2);await rt.default.writeFile(t,n)}};var le=class{spdxVersion;dataLicense="CC0-1.0";spdxId;name;documentNamespace;externalDocumentRefs;licenseListVersion;creators;created;creatorComment;documentComment;constructor(t,r,n,i,o,a){this.spdxVersion=t,this.name=r,this.documentNamespace=n,this.creators=i,this.created=o,this.externalDocumentRefs=a?.externalDocumentRefs??[],this.creatorComment=a?.creatorComment??void 0,this.licenseListVersion=a?.licenseListVersion??void 0,this.documentComment=a?.documentComment??void 0,this.spdxId=a?.spdxId??"SPDXRef-DOCUMENT"}};var fe=class{documentRefId;documentUri;checksum;constructor(t,r,n){this.documentRefId=t,this.documentUri=r,this.checksum=n}};var M=class{algorithm;value;constructor(t,r){this.algorithm=t,this.value=r}};var me=class{name;spdxId;checksums;fileTypes;constructor(t,r,n){this.name=t,this.spdxId="SPDXRef-"+C(),this.checksums=r,this.fileTypes=n?.fileTypes??[]}};var T=class extends H{static formatCreators(t){return t?Array.isArray(t)?t.map(r=>I.fromCreator(r)):[I.fromCreator(t)]:[]}static formatSpdxVersion(t){return"SPDX-"+(t??"2.3")}static generateNamespace(t){return"urn:"+(t.replace(/^[^A-Za-z0-9]+/,"").replace(/[^A-Za-z0-9-]/g,"-")??"document")+":"+C()}static formatExternalDocumentRefs(t){return t?t.map(r=>new fe(r.documentRefId,r.documentUri,new M(r.checksum_algorithm,r.checksum_value))):void 0}static createDocument(t,r){let n=new le(this.formatSpdxVersion(r?.spdxVersion),t,r?.namespace??this.generateNamespace(t),this.formatCreators(r?.creators).concat(I.tools()),r?.created??new Date,{...r,externalDocumentRefs:this.formatExternalDocumentRefs(r?.externalDocumentRefs)});return new T(n)}addPackage(t,r){let n=new de(t,r);return this.packages=this.packages.concat(n),n}addFile(t,r,n){let i=Array.isArray(r)?r.map(s=>new M(s.checksumAlgorithm,s.checksumValue)):[new M(r.checksumAlgorithm,r.checksumValue)],o=n?.fileTypes?n.fileTypes.map(s=>s):void 0,a=new me(t,i,{spdxId:n?.spdxId??void 0,fileTypes:o});return this.files=this.files.concat(a),a}addRelationship(t,r,n,i){function o(s){return typeof s=="string"?s:s instanceof H?s.creationInfo.spdxId:s.spdxId}let a=new j(o(t),o(r),n,{comment:i?.comment});return this.relationships=this.relationships.concat(a),this}async write(t,r=!1){let n=this.validate();n.length>0&&(console.error(`Document is invalid: ${n.join(`
`)}`),!r)||await this.writeFile(t)}writeSync(t,r=!1){let n=this.validate();if(n.length>0&&!r){console.error(`Document is invalid: ${n.join(`
`)}`);return}this.writeFile(t).then(()=>{console.log("Wrote SBOM successfully: "+t)}).catch(i=>{console.error("Error writing sample SBOM: "+i)})}};function Tr(e){return parseInt(e.split(".")[0])}function nt(e,t){let r=t?.spdxVersion;if(!r||Tr(r)===2)return T.createDocument(e,t);throw new Error("Unsupported SPDX version")}var X=f("clipanion");var h=f("@yarnpkg/core"),it=async(e,t,r)=>{let n=new Map,i;if(t){if(r){for(let c of e.workspaces)c.manifest.devDependencies.clear();let s=await h.Cache.find(e.configuration),u=new h.ThrowReport;await e.resolveEverything({report:u,cache:s})}i=e.storedDescriptors.values()}else i=e.workspaces.flatMap(s=>{let u=[s.anchoredDescriptor];for(let[c,d]of s.anchoredPackage.dependencies.entries())r&&s.manifest.devDependencies.has(c)||u.push(d);return u});let o=h.miscUtils.sortMap(i,[s=>h.structUtils.stringifyIdent(s),s=>h.structUtils.isVirtualDescriptor(s)?"0":"1",s=>s.range]),a=new Set;for(let s of o.values()){let u=e.storedResolutions.get(s.descriptorHash);if(!u)continue;let c=e.storedPackages.get(u);if(!c)continue;let{descriptorHash:d}=h.structUtils.isVirtualDescriptor(s)?h.structUtils.devirtualizeDescriptor(s):s;a.has(d)||(a.add(d),n.set(s,c))}return n};function Vr(e){let t={},r=e.match(/^([^(<]+)/);if(r){let o=r[0].trim();o&&(t.name=o)}let n=e.match(/<([^>]+)>/);n&&(t.email=n[1]);let i=e.match(/\(([^)]+)\)/);return i&&(t.url=i[1]),t}var st=e=>{let{license:t,licenses:r,repository:n,homepage:i,author:o}=e,a=typeof o=="string"?Vr(o):o;return{license:(()=>{if(t)return pe(t);if(r){if(!Array.isArray(r))return pe(r);if(r.length===1)return pe(r[0]);if(r.length>1)return`(${r.map(pe).join(" OR ")})`}return ot})(),url:n,vendorName:a?.name,vendorUrl:i||a?.url}},ot="UNKNOWN",pe=e=>(typeof e!="string"?e.type:e)||ot;var Ne={};K(Ne,{fs:()=>Br,getPackagePath:()=>Ur});var at=f("@yarnpkg/plugin-pnp"),ge=f("@yarnpkg/core"),ct=f("@yarnpkg/fslib");var w=()=>({os:[process.platform],cpu:[process.arch],libc:[]});var Ur=async(e,t)=>{if(br(e),!ge.structUtils.isPackageCompatible(t,w()))return null;let r=ge.structUtils.convertPackageToLocator(t),n={name:ge.structUtils.stringifyIdent(r),reference:r.reference},i=Ae.getPackageInformation(n);if(!i)return null;let{packageLocation:o}=i;return o},Ae,br=e=>{Ae||(Ae=module.require((0,at.getPnpPath)(e).cjs))},Br=new ct.VirtualFS({});var Y={};K(Y,{_getYarnStateAliases:()=>lt,fs:()=>Yr,getPackagePath:()=>qr});var O=f("@yarnpkg/core"),ut=f("@yarnpkg/parsers"),_=f("@yarnpkg/fslib");var qr=async(e,t)=>{if(await Hr(e),!O.structUtils.isPackageCompatible(t,w()))return null;let r=O.structUtils.convertPackageToLocator(t),n=O.structUtils.stringifyLocator(r),i=he[n]||dt[n];if(!i)return null;let o=i.locations[0];return o?_.ppath.join(e.cwd,o):e.cwd},he,dt,Hr=async e=>{if(!he){let t=_.ppath.join(e.configuration.projectCwd,_.Filename.nodeModules,".yarn-state.yml");he=(0,ut.parseSyml)(await _.xfs.readFilePromise(t,"utf8")),dt=lt(he)}},Yr=_.xfs,lt=e=>Object.entries(e).reduce((t,[r,n])=>{if(!n.aliases)return t;let i=O.structUtils.parseLocator(r);for(let o of n.aliases){let a=O.structUtils.makeLocator(i,o),s=O.structUtils.stringifyLocator(a);t[s]=n}return t},{});var ke={};K(ke,{fs:()=>Xr,getPackagePath:()=>Jr});var J=f("@yarnpkg/core"),v=f("@yarnpkg/fslib");var Jr=async(e,t)=>{if(!J.structUtils.isPackageCompatible(t,w()))return null;let r=J.structUtils.convertPackageToLocator(t),n=J.structUtils.slugifyLocator(r),i=J.structUtils.stringifyIdent(r),o=e.tryWorkspaceByLocator(r);return o?o.cwd:v.ppath.join(e.configuration.projectCwd,v.Filename.nodeModules,".store",n,v.Filename.nodeModules,i)},Xr=v.xfs;var ft=e=>{switch(e){case"pnp":return Ne;case"node-modules":return Y;case"pnpm":return ke;default:throw new Error("Unsupported linker")}};var Ee=f("@yarnpkg/fslib"),zr="NOASSERTION",Kr="SPDXRef-",jr="DEPENDS_ON",Gr="DESCRIBES",Wr=".spdx.json",V=class extends De.BaseCommand{constructor(){super(...arguments);this.recursive=X.Option.Boolean("-R,--recursive",!0,{description:"Include transitive dependencies (dependencies of direct dependencies)"});this.production=X.Option.Boolean("--production",!0,{description:"Exclude development dependencies"})}async execute(){let r=await xe.Configuration.find(this.context.cwd,this.context.plugins),{project:n,workspace:i}=await xe.Project.find(r,this.context.cwd);if(!i)throw new De.WorkspaceRequiredError(n.cwd,this.context.cwd);await n.restoreInstallState();let o=nt(i.manifest.name?.name??"spdx"),a=await it(n,this.recursive,this.production),s=[...a].flatMap(([,D])=>[...D.dependencies].flatMap(([,l])=>l.descriptorHash)),u=n.configuration.get("nodeLinker"),c;typeof u=="string"?c=ft(u):c=Y;let d=new Set;for(let[D,l]of a.entries()){let ye=await c.getPackagePath(n,l);if(ye===null)continue;let gt=JSON.parse(await c.fs.readFilePromise(Ee.ppath.join(ye,Ee.Filename.manifest),"utf8")),{license:ht,url:Dt}=st(gt),xt=$r(Dt),U=mt(l);if(!d.has(U)){d.add(U),o.addPackage(l.name,{downloadLocation:xt,spdxId:U,licenseConcluded:ht});for(let[,Et]of l.dependencies.entries()){let Re=n.storedResolutions.get(Et.descriptorHash);if(!Re)continue;let Le=n.storedPackages.get(Re);!Le||o.addRelationship(U,mt(Le),jr)}s.includes(D.descriptorHash)||o.addRelationship(o,U,Gr)}}o.writeSync((i.manifest.name?.name??"")+Wr)}};V.paths=[["spdx"]],V.usage=X.Command.Usage({description:"Generate SPDX document for the project",details:`
        This command generates an SPDX document for the project. By default, the document will be placed in the root of the project.

        If \`-R,--recursive\` is set, the listing will include transitive dependencies (dependencies of direct dependencies).

        If \`--production\` is set, the listing will exclude development dependencies.`,examples:[["Generate SPDX document","$0 spdx"],["Generate SPDX document with only direct dependencies","$0 spdx --recursive true"],["Generate SPDX document with only production dependencies","$0 spdx --production true"]]});function $r(e){return e&&typeof e=="object"&&rn(e.url)?e.url:zr}var pt="(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/|ssh:\\/\\/|git:\\/\\/|svn:\\/\\/|sftp:\\/\\/|ftp:\\/\\/)?([\\w\\-.!~*'()%;:&=+$,]+@)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+){0,100}\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?",Qr="(git|hg|svn|bzr)",Zr="(git\\+git@[a-zA-Z0-9\\.\\-]+:[a-zA-Z0-9/\\\\.@\\-]+)",en="(bzr\\+lp:[a-zA-Z0-9\\.\\-]+)",tn="^((("+Qr+"\\+)?"+pt+")|"+Zr+"|"+en+")$";function rn(e){return new RegExp(pt).test(e)&&new RegExp(tn).test(e)}function mt(e){let t=e.name.replace(/^@/,"").replace(/_/g,"-"),r=e.version.replace(/\//g,".").replace(/_/g,"-");return Kr+t+"-"+r}var nn={commands:[V]},sn=nn;return vt(on);})();
return plugin;
}
};
