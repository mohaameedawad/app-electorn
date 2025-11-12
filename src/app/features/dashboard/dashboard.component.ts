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

  constructor(
    private dbService: DatabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadCounts();
  }

  async loadCounts() {
    try {
      const products = await this.dbService.getProducts();
      const customers = await this.dbService.getCustomers();
      const suppliers = await this.dbService.getSuppliers();

      this.productsCount = products.length;
      this.customersCount = customers.length;
      this.suppliersCount = suppliers.length;
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
