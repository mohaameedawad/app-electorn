import { Component } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';

@Component({
  selector: 'app-reports',
  imports: [TableComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  columns = [
    { header: 'التقرير', field: 'reportName' },
    { header: 'التاريخ', field: 'date' },
    { header: 'النوع', field: 'type' },
    { header: 'القيمة', field: 'value' },
  ];

  data = [
    { reportName: 'تقرير المبيعات الشهري', date: '2025-11-01', type: 'مبيعات', value: 150000 },
    { reportName: 'تقرير المشتريات', date: '2025-11-03', type: 'مشتريات', value: 85000 },
    { reportName: 'تقرير الأرباح', date: '2025-11-07', type: 'أرباح', value: 65000 },
    { reportName: 'تقرير المخزون', date: '2025-11-09', type: 'مخزون', value: 250000 },
  ];
}
