import { Component, OnInit } from "@angular/core";
import { UnitConverterService } from "../../services/unit-converter.service";

@Component({
  selector: "app-unit-converter",
  templateUrl: "./unit-converter.component.html",
  styleUrls: ["./unit-converter.component.css"],
})
export class UnitConverterComponent implements OnInit {
  value: number = 1;
  selectedCategory: string = "Lunghezza";
  fromUnit: string = "metri";
  toUnit: string = "chilometri";
  result: number = 0;
  error: string = "";

  categories: any[] = [];
  availableUnits: string[] = [];

  constructor(private unitService: UnitConverterService) {}

  ngOnInit() {
    this.categories = this.unitService.getCategories();
    this.updateAvailableUnits();
  }

  onCategoryChange() {
    this.updateAvailableUnits();
    if (this.availableUnits.length > 0) {
      this.fromUnit = this.availableUnits[0];
      this.toUnit = this.availableUnits[1] || this.availableUnits[0];
    }
    this.convert();
  }

  updateAvailableUnits() {
    const category = this.unitService.getCategoryByName(this.selectedCategory);
    this.availableUnits = category ? category.units : [];
  }

  convert() {
    if (this.value === null || this.value === undefined) {
      this.error = "Inserisci un valore valido";
      return;
    }

    this.error = "";

    try {
      this.result = this.unitService.convert(
        this.value,
        this.fromUnit,
        this.toUnit,
        this.selectedCategory
      );
    } catch (err: any) {
      this.error = "Errore durante la conversione: " + err.message;
      this.result = 0;
    }
  }

  swapUnits() {
    const temp = this.fromUnit;
    this.fromUnit = this.toUnit;
    this.toUnit = temp;
    this.convert();
  }
}
