//% color=190 weight=100 icon="\uf028" block="micro:bit Talker"
namespace Talker{
    function speak(msg: string) {
        dummy = serial.readString()
        // ★CRで実行される。LFは送らない
        serial.writeString("" + msg + CR)
        start2 = input.runningTime()
        while (input.runningTime() - start2 < 15000) {
            buf2 = "" + buf2 + serial.readString()
            if (buf2.indexOf(">") >= 0) {
                return
            }
            basic.pause(10)
        }
        // 応答なし=異常。再同期して復帰
        atpWaitReady()
    }
    function atpTrySync() {
        dummy = serial.readString()
        // '?' 単独。CRは付けない
        serial.writeString("?")
        start = input.runningTime()
        while (input.runningTime() - start < 400) {
            buf = "" + buf + serial.readString()
            if (buf.indexOf(">") >= 0) {
                return true
            }
            basic.pause(10)
        }
        return false
    }
    /*
    input.onButtonPressed(Button.A, function () {
        // 挨拶中はスマイル
        basic.showIcon(IconNames.Happy)
        speak("tesuto tesuto")
        basic.showIcon(IconNames.Heart)
    })
    */
    // ===== ATP3011 ヘルパー =====
    function atpReset() {
        pins.digitalWritePin(ATP_RESET, 1)
        basic.pause(5)
        pins.digitalWritePin(ATP_RESET, 0)
        basic.pause(20)
        pins.digitalWritePin(ATP_RESET, 1)
        basic.pause(120)
    }
    function init() {
        // ──1kΩ── J4-1 (/RESET)
        ATP_RESET = DigitalPin.P12
        // ★ブロック変換でも壊れないCR
        CR = String.fromCharCode(13)
        pins.digitalWritePin(ATP_RESET, 1)
        pins.setAudioPin(DigitalPin.P15)
        serial.redirect(
            SerialPin.P8,
            SerialPin.P16,
            BaudRate.BaudRate9600
        )
        serial.setRxBufferSize(64)
        // リセット→'?'→'>' まで確実に
        atpWaitReady()
        basic.pause(50)
    }
    function atpWaitReady() {
        atpReset()
        while (!(atpTrySync())) {
            basic.pause(200)
            atpReset()
        }
    }
    let ATP_RESET = 0
    let buf = ""
    let start = 0
    let buf2 = ""
    let start2 = 0
    let CR = ""
    let dummy = ""
    /*
    basic.showLeds(`
    . . . . .
    . . . . .
    . . # . .
    . . . . .
    . . . . .
    `)
    init()
    basic.showIcon(IconNames.Heart)
*/
//ここまでnamespace
}
