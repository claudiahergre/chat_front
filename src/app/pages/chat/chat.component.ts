import { Component, ElementRef, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import JSConfetti from 'js-confetti'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  socket = io('https://chat-back-r6xa.onrender.com')

  data: any = {};
  mensajes: any[] = [];
  numClientes: number = 0
  audioOn: boolean = true;

  @ViewChild('divMensajes') divMensajes!: ElementRef

  ngOnInit() {
    this.socket.on('mensaje_chat', (data) => {
      console.log(data.socket_id, this.socket.id)
      if (this.audioOn && (data.socket_id !== this.socket.id)) {
        let audio: HTMLAudioElement = new Audio('https://cdn.videvo.net/videvo_files/audio/premium/audio0303/watermarked/_Soundstorm%206_Tones-AlertDing-Melodic-H-2_B04-08417_preview.mp3');
        audio.play();
      }
      // cada vez que llegue un nuevo mensaje lo ponemos en el array y lo pintamos en el html
      this.mensajes.push(data)
      this.divMensajes.nativeElement.scrollTop = this.divMensajes.nativeElement.scrollHeight
    })

    this.socket.on('clientes_conectados', num => {
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti();
      this.numClientes = num
    })

  }

  onClick() {
    //console.log(this.data)
    this.data.socket_id = this.socket.id;
    this.socket.emit('mensaje_chat', this.data) //ver el index en la app del back (server)
  }

}
