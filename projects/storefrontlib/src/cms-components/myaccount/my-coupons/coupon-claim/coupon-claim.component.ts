import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  RoutingService,
  CustomerCouponService,
  GlobalMessageService,
  GlobalMessageType,
} from '@spartacus/core';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './coupon-claim.component.html',
  selector: 'cx-coupon-claim',
})
export class CouponClaimComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor(
    private couponService: CustomerCouponService,
    private routingService: RoutingService,
    private messageService: GlobalMessageService
  ) {}

  ngOnInit(): void {
    this.routingService
      .getRouterState()
      .subscribe(k => {
        const couponCode = k.state.params.couponCode;
        if (couponCode) {
          this.couponService.claimCustomerCoupon(couponCode);
          this.subscription = this.couponService
            .getClaimCustomerCouponResultSuccess()
            .subscribe(success => {
              if (success) {
                this.messageService.add(
                  { key: 'myCoupons.claimCustomerCoupon' },
                  GlobalMessageType.MSG_TYPE_CONFIRMATION
                );
              }
              this.routingService.go('/my-account/coupons');
            });
        } else {
          this.routingService.go('/not-found');
        }
      })
      .unsubscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}