import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, Table } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, InputTextModule, SelectModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() columns!: any[]
  @Input() data!: any[];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() preview = new EventEmitter<any>();
  @Output() print = new EventEmitter<any>();

  @ViewChild('dt') table!: Table;

  selectedFilterColumn: string = '';
  filterValue: string = '';

  ngOnInit() {
    // Set the first filterable column as default
    const filterableColumns = this.getFilterableColumns();
    if (filterableColumns.length > 0) {
      this.selectedFilterColumn = filterableColumns[0].field;
    }
  }

  getFilterableColumns() {
    return this.columns?.filter(col => col.type !== 'actions' && col.field !== 'actions') || [];
  }

  getSelectedColumnHeader(): string {
    const column = this.columns?.find(col => col.field === this.selectedFilterColumn);
    return column ? column.header : '';
  }

  onFilterChange() {
    if (this.table) {
      this.table.filter(this.filterValue, this.selectedFilterColumn, 'contains');
    }
  }

  clearFilter() {
    this.filterValue = '';
    if (this.table) {
      this.table.clear();
    }
  }

  hasAction(col: any, action: string): boolean {
    return col.actions && Array.isArray(col.actions) && col.actions.includes(action);
  }
}