import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopService } from 'src/app/service/shop.service';
@Component({
  selector: 'app-shop-edit',
  templateUrl: './shop-edit.component.html',
  styleUrls: ['./shop-edit.component.scss']
})
export class ShopEditComponent implements OnInit {
  validationform!: FormGroup;
  shopId!:string
  submit!: boolean;

  constructor( private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private shopService: ShopService,
    ){}

  ngOnInit(): void {
    this.shopId = this.route.snapshot.params['id'];
    
    this.validationform = this.formBuilder.group({
      shopName : ['',[Validators.required]],
      storeNumber : ['',[Validators.required]],
      contractNumber : ['',[Validators.required]],
      meterNumber : ['',[Validators.required]],
      contractOwner : ['',[Validators.required]],
    })
  };

  get f() { return this.validationform!.controls; }

  formSubmit(){
    console.log(this.validationform.value);
    this.shopService.update(this.validationform.value)
      .then((shop) => { console.log("shop") })
      .catch(error => { console.log(error) });
  }

    /**
   * Bootsrap validation form submit method
   */
  validSubmit() {
    this.submit = true;
  }

  

}
