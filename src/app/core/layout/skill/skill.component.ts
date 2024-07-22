import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-skill',
  standalone: true,
  imports: [CardModule, TranslateModule, CommonModule],
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.scss',
})
export class SkillComponent {
  cardsContent = [
    {
      title: 'SKILL.ITEM_1',
      img: 'assets/img/program_img.png',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita asperiores quis ad saepe esse eius quae praesentium qui unde cum.',
    },
    {
      title: 'SKILL.ITEM_2',
      img: 'assets/img/framework_img.png',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita asperiores quis ad saepe esse eius quae praesentium qui unde cum.',
    },
    {
      title: 'SKILL.ITEM_3',
      img: 'assets/img/tool_img.png',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita asperiores quis ad saepe esse eius quae praesentium qui unde cum.',
    },
    {
      title: 'SKILL.ITEM_4',
      img: 'assets/img/database_img.png',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita asperiores quis ad saepe esse eius quae praesentium qui unde cum.',
    },
  ];
}
