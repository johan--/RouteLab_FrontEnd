import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
import { AgmCoreModule } from '@agm/core';
import { PostService } from '../services/post.service';
import { Post } from '../models/post';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { post } from 'selenium-webdriver/http';

declare var $: any;
declare var jquery: any;

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css'],
  providers: [PostService]
})
export class RouteComponent implements OnInit {

  commentForm: FormGroup;
  public currentUser: User;
  private id = this.route.snapshot.paramMap.get('id');
  public post: Post = new Post();
  public comments: any = [];
  STAR = ('../../assets/icons/star.png');
  CURRENTIMG = ('../../assets/img/route_image.png');
  ROUTEIMGS = [
    '../../assets/img/sample_images/1.jpg',
    '../../assets/img/sample_images/2.jpg',
    '../../assets/img/sample_images/3.jpg',
    '../../assets/img/sample_images/4.jpg',
    '../../assets/img/sample_images/5.jpg',
    '../../assets/img/sample_images/6.jpg',
    '../../assets/img/sample_images/7.jpg',
    '../../assets/img/sample_images/8.jpg',
    '../../assets/img/sample_images/9.jpg',
    '../../assets/img/sample_images/10.jpg'
  ];

  routeMarkers: any = null;


  constructor(public _loginService: LoginService, private _postService: PostService, private route: ActivatedRoute,
              private formBuilder: FormBuilder) {
  }

  ngAfterViewInit(): void {
    $('.photo__preview').slick({
      arrows: false,
      centerMode: true,
      centerPadding: '0',
      slidesToShow: 5,
      focusOnSelect: true,
      dots: false,
      infinite: true,

    });
  }

  loadPost() {
    this._postService.getPost(this.id).subscribe(
      resul => {
        if (resul.body !== null) {
          this.post = <Post>resul.body['data'];

          console.log(this.post);
          console.log(this.post.markers[0].latitud);
          this.loadMarkers();
        }
      }, error => {
        console.log(error);

      }
    );
  }
  loadComments() {
    this._postService.getComment(this.id).subscribe(
      resul => {
        if (resul.body !== null) {
          this.comments = resul.body['data'];
          console.log(this.comments);
        }
      }, error => {
        console.log(error);

      }
    );
  }
  loadMarkers() {
    this.routeMarkers = {
      lat: parseFloat(this.post.markers[0].latitud),
      lng: parseFloat(this.post.markers[0].longitud),
      origin: {
        lat: parseFloat(this.post.markers[0].latitud),
        lng: parseFloat(this.post.markers[0].longitud)
      },
      destination: {
        lat: parseFloat(this.post.markers[this.post.markers.length - 1].latitud),
        lng: parseFloat(this.post.markers[this.post.markers.length - 1].longitud)
      }
    };
    this.routeMarkers.waypoints = [];
    if (this.post.markers.length > 2) {
      for (const cont in this.post.markers) {
        if (Number(cont) !== 0 && Number(cont) !== this.post.markers.length - 1) {
          const location = {
            lat: parseFloat(this.post.markers[cont].latitud),
            lng: parseFloat(this.post.markers[cont].longitud)
          };
          this.routeMarkers.waypoints.push({
            location: location
          });
        }
      }
    }
    console.log(this.routeMarkers);
  }
  addComment() {
    const comment = {
      'idusuario': this.currentUser.idusuario,
      'comentario': this.commentForm.controls.comment.value,
      'idpost': this.id
    };
    this._postService.postComment(JSON.stringify(comment)).subscribe(
      resul => {
        console.log(resul.body);
        this.loadComments();
      }, error => {
        console.log(error);
      }
    );
    this.commentForm.controls.comment.setValue('');
  }

  loadPhoto(photo) {
    this.CURRENTIMG = photo;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadPost();
    this.loadComments();
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]]
    });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

  }

}
