export default {
 journey(s) {
  s.box('FRONTEND', {id:'web',x:350,y:530,w:470,h:250,icon:'monitor',iconSize:100,color:'blue',size:52,at:0});
  s.box('SERVER', {id:'server',x:730,y:940,w:470,h:250,icon:'server',iconSize:100,color:'green',size:52,at:4.1});
  s.arrow('web','server',{at:5.1,width:7,color:'blue',headSize:25,bend:-.3});
  s.box('LANGMIND', {id:'agent',x:350,y:1350,w:470,h:250,icon:'bot',iconSize:100,color:'orange',size:52,at:7.5});
  s.arrow('server','agent',{at:8.6,width:7,color:'green',headSize:25,bend:.3});
  s.arrow([130,1300],[130,570],{at:12.2,width:8,color:'orange',headSize:30,bend:-.3});
  s.icon('message-circle',{x:150,y:800,size:100,color:'orange',at:13.1});
  s.icon('lock-keyhole',{x:915,y:935,size:70,color:'green',at:16});
 }
};

