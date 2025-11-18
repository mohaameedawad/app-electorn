import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  productsCount = 0;
  customersCount = 0;
  suppliersCount = 0;

  cards = [
    {
      icon: 'pi-box',
      title: 'المنتجات',
      count: 0,
      route: '/products'
    },
    {
      icon: 'pi-users',
      title: 'العملاء',
      count: 0,
      route: '/customers'
    },
    {
      icon: 'pi-truck',
      title: 'الموردين',
      count: 0,
      route: '/suppliers'
    }
  ];

  constructor(
    private dbService: DatabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadCounts();
  }

  async loadCounts() {
    try {
      // const products = await this.dbService.getAllProducts();
      const customers = await this.dbService.getAllCustomers();
      const suppliers = await this.dbService.getAllSuppliers();

      // this.productsCount = products.length;
      this.customersCount = customers.length;
      this.suppliersCount = suppliers.length;

      // Update cards array
      // this.cards[0].count = this.productsCount;
      this.cards[1].count = this.customersCount;
      this.cards[2].count = this.suppliersCount;
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
