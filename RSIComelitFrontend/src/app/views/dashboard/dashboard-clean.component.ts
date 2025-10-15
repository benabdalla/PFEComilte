import { Component, inject, OnInit } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

import { UserService } from '../../shared/service/user.service';
import { PostService } from '../../shared/service/post.service';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent, IconDirective]
})
export class DashboardComponent implements OnInit {

  // Inject services
  private userService = inject(UserService);
  private postService = inject(PostService);

  // Employee Statistics
  public employeeStats = {
    totalUsers: 0,
    totalPosts: 0,
    loading: true
  };

  // Gallery Images with your organizational chart
  public galleryImages = [
    {
      src: './assets/images/organigrame.jpeg',
      title: 'Company Organization',
      description: 'Our complete organizational structure and team hierarchy'
    },
    {
      src: './assets/images/components.webp',
      title: 'Team Collaboration',
      description: 'Our teams working together on innovative projects'
    },
    {
      src: './assets/images/cover.jpg',
      title: 'Office Environment',
      description: 'Modern workspace designed for productivity'
    },
    {
      src: './assets/images/angular.jpg',
      title: 'Technology Stack',
      description: 'Cutting-edge technologies we use daily'
    }
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    let loadedCount = 0;
    const totalApiCalls = 2;

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
        loadedCount++;
        if (loadedCount === totalApiCalls) {
          this.employeeStats.loading = false;
        }
      }
    });

    // Load total posts count
    this.postService.getAllPosts(0, 100).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.employeeStats.totalPosts = response.length;
        } else {
          this.employeeStats.totalPosts = 0;
        }
        loadedCount++;
        if (loadedCount === totalApiCalls) {
          this.employeeStats.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading posts count:', error);
        this.employeeStats.totalPosts = 0;
        loadedCount++;
        if (loadedCount === totalApiCalls) {
          this.employeeStats.loading = false;
        }
      }
    });
  }
}