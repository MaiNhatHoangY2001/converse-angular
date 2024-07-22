import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';

interface Reponsive {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
}

@Component({
  selector: 'app-latest-work',
  standalone: true,
  imports: [CardModule, CarouselModule, TranslateModule, CommonModule, ButtonModule],
  templateUrl: './latest-work.component.html',
  styleUrl: './latest-work.component.scss',
})
export class LatestWorkComponent implements OnInit {
  products = [
    {
      name: 'Converse - Chat with AI',
      img: 'assets/img/product-default.png',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita asperiores quis ad saepe esse eius quae praesentium qui unde cum.',
    },
    {
      name: 'Converse - Chat with AI',
      img: 'assets/img/product-default.png',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita asperiores quis ad saepe esse eius quae praesentium qui unde cum.',
    },
    {
      name: 'Converse - Chat with AI',
      img: 'assets/img/product-default.png',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita asperiores quis ad saepe esse eius quae praesentium qui unde cum.',
    },
    {
      name: 'Converse - Chat with AI',
      img: 'assets/img/product-default.png',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita asperiores quis ad saepe esse eius quae praesentium qui unde cum.',
    },
    {
      name: 'Converse - Chat with AI',
      img: 'assets/img/product-default.png',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita asperiores quis ad saepe esse eius quae praesentium qui unde cum.',
    },
  ];

  responsiveOptions: Reponsive[] | undefined;

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1280px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '640px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
}
