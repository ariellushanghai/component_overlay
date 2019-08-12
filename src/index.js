import 'babel-polyfill'
import Overlay from './overlay';

const init = () => {
    const confirmCallback = () => alert(JSON.stringify(`confirmCallback() @ ${(new Date()).toLocaleTimeString()}`));
    const cancelCallback = () => alert(JSON.stringify(`cancelCallback() @ ${(new Date()).toLocaleTimeString()}`));


    const demo_callback = new Overlay({
        title: '回调示例',
        content: `<p>点 'Confirm()' 执行 "confirmCallback"</p>
                  <p>点 'Cancel()' 执行 "cancelCallback"</p>
                 `,
        callback_confirm: confirmCallback, // Function
        callback_cancel: cancelCallback, // Function
        text_confirm: 'Confirm()',
        text_cancel: 'Cancel()',
        flag_html_as_content: true,
    });

    const demo_rich_text = new Overlay({
        title: '标题文字',
        content: `<h2>富文本内容</h2>
                  <p style="color: red;">红字</p>
                  <p style="text-decoration: line-through">划线</p>
                  <p style="background-color: greenyellow">"background-color: greenyellow"</p>
                 `,
        flag_html_as_content: true
    });

    const demo_control = new Overlay({
        title: '编程控制',
        content: `<span>延时1秒后调用实例方法:</span>
                  <pre style="display: inline-block;">close()</pre>
                  <span>关闭</span>
                 `,
        flag_html_as_content: true
    });

    document.querySelector('#btn_0').addEventListener('click', () => {
        demo_callback.open()
    });
    document.querySelector('#btn_1').addEventListener('click', () => {
        demo_rich_text.open()
    });
    document.querySelector('#btn_2').addEventListener('click', () => {
        demo_control.open();
        setTimeout(_ => demo_control.close(), 1e3)
    });

};

window.addEventListener('DOMContentLoaded', init);

