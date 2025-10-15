import { Component, inject, OnInit } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  CarouselComponent,
  CarouselItemComponent,
  CarouselIndicatorsComponent,
  CarouselInnerComponent,
  ColComponent,
  RowComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

import { UserService } from '../../shared/service/user.service';
import { PostService } from '../../shared/service/post.service';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    RowComponent,
    ColComponent,
    IconDirective,
    CarouselComponent,
    CarouselItemComponent,
    CarouselIndicatorsComponent,
    CarouselInnerComponent
  ]
})
export class DashboardComponent implements OnInit {


  // Inject services
  private userService = inject(UserService);
  private postService = inject(PostService);

  // Employee Statistics
  public employeeStats = {
    totalUsers: 0,
    totalPosts: 0,
    loading: true,
    error: null as string | null
  };

  // Gallery Images using available assets
  public galleryImages = [
    {
      src: './assets/images/organigrame.jpeg',
      title: 'Company Organization',
      description: 'Our complete organizational structure and team hierarchy'
    },
    {
      src: 'https://comelitgroup.fr/wp-content/themes/wsk-theme/media/images/user_types/gestionnaire.png',
      title: 'Management Portal',
      description: 'Administrative interface for system managers and supervisors'
    },
    {
      src: 'https://comelitgroup.fr/wp-content/uploads/2023/03/mondo-sicuro-utilisateur-homepage.webp',
      title: 'Secure World Solutions',
      description: 'Comprehensive security solutions for users and administrators'
    },
    {
      src: 'https://comelitgroup.fr/wp-content/uploads/2023/01/Professionista_soluzioni_appartamento_antintrusione-securhub.webp',
      title: 'Professional Security Hub',
      description: 'Advanced apartment and building security solutions for professionals'
    }
  ];

  // Carousel Data based on the provided HTML
  public carouselSlides = [
    {
      image: 'https://comelitgroup.fr/wp-content/uploads/2024/11/Sostenibilita-door.jpg',
      overline: 'Sustainable Development',
      title: 'Tomorrow\'s Security',
      description: 'For Comelit, sustainable development is essential: it\'s about contributing to a safer future by reducing our environmental impact, taking care of everyone who works with us, and making our production processes efficient, with the support of sustainable technologies.',
      ctaText: 'Learn More',
      ctaLink: 'https://comelitgroup.fr/developpement-durable/'
    },
    {
      image: 'https://comelitgroup.fr/wp-content/uploads/2024/11/Cybersecurity-door.jpg',
      overline: 'Cyber Security',
      title: 'Your data is truly secure',
      description: 'Data security is a priority for us, and we are committed to protecting it. Because being able to guarantee that every data processed, every video recorded, every face captured is truly safe is an ethical commitment for us.',
      ctaText: 'Learn More',
      ctaLink: 'https://comelitgroup.fr/cybersecurite/'
    },
    {
      image: 'https://comelitgroup.fr/wp-content/uploads/2024/11/Inclusione-door.jpg',
      overline: 'Inclusivity',
      title: 'Us for you, you with us',
      description: 'At Comelit, we place people at the center of our concerns, valuing potential and differences to foster creativity and innovation. We guarantee people who work with us a safe and inclusive environment, a good work-life balance and many benefits.',
      ctaText: 'Learn More',
      ctaLink: 'https://comelitgroup.fr/travailler-avec-nous/'
    }
  ];




  ngOnInit(): void {
    this.loadDashboardData();
  }

  public refreshDashboard(): void {
    this.employeeStats.loading = true;
    this.employeeStats.error = null;
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    let loadedCount = 0;
    const totalApiCalls = 2;
    this.employeeStats.error = null;

    // Load total users count
    this.userService.getUsers({ page: 1, limit: 1 }).subscribe({
      next: (response) => {
        this.employeeStats.totalUsers = response.total || 0;
        loadedCount++;
        if (loadedCount === totalApiCalls) {
          this.employeeStats.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading users count:', error);
        this.employeeStats.totalUsers = 0;
        this.employeeStats.error = 'Failed to load some statistics';
        loadedCount++;
        if (loadedCount === totalApiCalls) {
          this.employeeStats.loading = false;
        }
      }
    });

    // Try to load posts count with fallback approach
    this.loadPostsCount(() => {
      loadedCount++;
      if (loadedCount === totalApiCalls) {
        this.employeeStats.loading = false;
      }
    });
  }

  private loadPostsCount(callback: () => void): void {
    // First try with a smaller page size to avoid server overload
    this.postService.getAllPosts(0, 10).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          // For now, we'll show the count of recent posts
          // You may want to implement a dedicated endpoint for total count
          this.employeeStats.totalPosts = response.length;
        } else {
          this.employeeStats.totalPosts = 0;
        }
        callback();
      },
      error: (error) => {
        console.warn('getAllPosts failed, trying getAllMyPosts:', error);
        // Fallback to user's own posts
        this.postService.getAllMyPosts(0, 10).subscribe({
          next: (response) => {
            if (Array.isArray(response)) {
              this.employeeStats.totalPosts = response.length;
            } else {
              this.employeeStats.totalPosts = 0;
            }
            callback();
          },
          error: (error) => {
            console.error('Both post APIs failed:', error);
            // Set to 0 if both APIs fail
            this.employeeStats.totalPosts = 0;
            callback();
          }
        });
      }
    });
  }







}
