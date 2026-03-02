import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { FUTURE_SERVICES, SERVICES } from '../../config/marketing-content';

@Component({
  selector: 'app-services-page',
  imports: [HeroComponent, ServiceCardComponent],
  template: `
    <app-hero
      title="Servicios Nous Labs"
      subtitle="En v1 trabajamos con un único servicio activo: Asistente IA Operativo Nivel Entry."
      primaryLabel="Solicitar diagnóstico Entry"
      primaryRoute="/contacto"
      secondaryLabel="Ver Servicio Entry"
      secondaryRoute="/servicios/asistente-ia-operativo"
    />
    <section class="container services-list section-grid">
      <h2>Servicio activo</h2>
      <div class="cards-grid">
        @for (service of services; track service.title) {
          <app-service-card [title]="service.title" [description]="service.description" [route]="service.route" />
        }
      </div>

      <h3>Próximamente</h3>
      <div class="cards-grid muted-grid">
        @for (service of futureServices; track service.title) {
          <app-service-card [title]="service.title" [description]="service.description" />
        }
      </div>
    </section>
  `,
  styleUrl: './services.page.scss',
})
export class ServicesPage {
  readonly services = SERVICES;
  readonly futureServices = FUTURE_SERVICES;
}
