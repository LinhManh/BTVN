const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let danhSachNguoiGui = []

io.on('connection', (socket) => {
  danhSachNguoiGui.push({id: socket.id, dem: 0})
  socket.on('chat message', msg => {
    for (let i=0; i<danhSachNguoiGui.length; i++){
      if (danhSachNguoiGui[i].id == socket.id){
        let bienDemCuaNguoiHienTai = danhSachNguoiGui[i].dem
        if (bienDemCuaNguoiHienTai < 2){
          if (msg == 'fuck you'){
            bienDemCuaNguoiHienTai++
            io.emit('chat message', '***********')
            danhSachNguoiGui[i].dem = bienDemCuaNguoiHienTai
          }else{
            io.emit('chat message', msg)
        }
        }else{
          io.emit('chat message', {thongBao: 'Tai khoan da bi khoa bi khoa trong 5 phut', idNguoiDung: socket.id})
          danhSachNguoiGui[i].dem = 0 // gan lai gia tri dem bang 0 reset sau khi mo khoa
        }
      }
    }
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
