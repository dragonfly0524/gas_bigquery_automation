function setTrigger(){
 
  const time = new Date();
  time.setHours(08);
  time.setMinutes(00);
  ScriptApp.newTrigger('onRunQuery').timeBased().at(time).create();
 
}

function delTrigger() {
 
  const triggers = ScriptApp.getProjectTriggers();
  for(const trigger of triggers){
    if(trigger.getHandlerFunction() == "onRunQuery"){
      ScriptApp.deleteTrigger(trigger);
    }
  }
  
}