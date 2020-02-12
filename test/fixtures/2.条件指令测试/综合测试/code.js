let a = (
    <div
        if={true}
        {...{ "a": 1 }}
        accessKey={123}
        if={parseInt("123")}
    >
        {<div
            if={true}
            if={123 + 456}
        />}
        {"asdf" || <div if="alkdj"/>}
        <div>
            <a if={<span/>} u="1">1</a>
            <span else="123" x="x">4</span>
            
            <a if="333" x>a</a>
            <b elseIf="2" x>b</b>
            <d else x>d</d>
            
            <a if="333" u>a</a>
            <c elseIf="3" x>c</c>
            
            <d elseIf="4" {...{}} x>
                <a href=""></a>
            </d>
            <e else x>e</e>
        </div>
    </div>
)