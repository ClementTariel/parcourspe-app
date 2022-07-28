window.api.send("requestEtabs",0);
window.api.receive("sendEtabs", (etabs) => {
  if(etabs != null && etabs.length>0){
    for (let i=0; i<etabs.length; i++){
      let etab = etabs[i];
      let etab_id = etab[0];
      let etab_name = etab[1];
      insertElement("etabList",createElement(etab_id,etab_name));
    }
  }
});

window.api.receive("sendEtabId", (etab_id) => {
  if (etab_id<0){
    alert("Nom invalide !");
  }else{
    window.location.replace("showData.html?i="+etab_id);
  }
  
});

