<div if="true"/>
let a = <div if={ true }/>
let b = <div if={ true + 3 || 4 }/>
let c = <div
    if={ true + 3 || 4 }
    if={ 567 }
/>
let d = <div
    x="5"
    if={ true + 3 || 4 }
    { ...{ b: 2 } }
    y="4"
    if={ {} }
/>
let e = <div>
    <a if={ true }/>
    <div if={ false }/>
</div>