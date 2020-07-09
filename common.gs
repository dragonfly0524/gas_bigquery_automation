// メニューバーにカスタムメニューの追加
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('更新ボタン')
      .addItem('更新', 'onRunQuery')
      .addToUi();
}