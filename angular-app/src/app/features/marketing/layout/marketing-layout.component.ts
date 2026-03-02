import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from '../components/site-header/site-header.component';
import { SiteFooterComponent } from '../components/site-footer/site-footer.component';

@Component({
  selector: 'app-marketing-layout',
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  template: `
    <app-site-header />
    <main class="marketing-shell"><router-outlet /></main>
    <app-site-footer />
  `,
  styleUrl: './marketing-layout.component.scss',
})
export class MarketingLayoutComponent {}
