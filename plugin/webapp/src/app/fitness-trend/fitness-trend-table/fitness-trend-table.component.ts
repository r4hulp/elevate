import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserSettingsService } from "../../shared/services/user-settings/user-settings.service";
import { FitnessService } from "../shared/service/fitness.service";
import { IUserSettings } from "../../../../../common/scripts/interfaces/IUserSettings";
import { DayFitnessTrendModel } from "../shared/models/day-fitness-trend.model";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import * as _ from "lodash";

@Component({
	selector: 'app-fitness-trend-table',
	templateUrl: './fitness-trend-table.component.html',
	styleUrls: ['./fitness-trend-table.component.scss']
})
export class FitnessTrendTableComponent implements OnInit, AfterViewInit {

	public readonly isSwimEnabled: boolean = true;
	public readonly isPowerMeterEnabled: boolean = true;

	@ViewChild(MatPaginator)
	public paginator: MatPaginator;

	// public fitnessTrend: DayFitnessTrendModel[];
	public cyclingFtp: number = null;
	public swimFtp: number = null;
	public displayedColumns: string[];
	public dataSource: MatTableDataSource<DayFitnessTrendModel>;

	constructor(private userSettingsService: UserSettingsService,
				private fitnessService: FitnessService) {
	}

	public ngOnInit(): void {

		console.warn("Run FitnessTrendTable Component ngOnInit");

		this.dataSource = new MatTableDataSource<DayFitnessTrendModel>();

		this.displayedColumns = ['date', 'type', 'activities', 'trimpScore', 'powerStressScore'];

		this.userSettingsService.fetch().then((userSettings: IUserSettings) => {

			this.cyclingFtp = userSettings.userFTP;
			this.swimFtp = userSettings.userSwimFTP;

			return this.fitnessService.computeTrend(this.isPowerMeterEnabled, this.cyclingFtp, this.isSwimEnabled, this.swimFtp);

		}).then((fitnessTrendModels: DayFitnessTrendModel[]) => {

			// Remove preview days
			fitnessTrendModels = _.filter(fitnessTrendModels, {
				previewDay: false,
			});

			/*_.forEach(fitnessTrendModels, (dayFitnessTrendModel: DayFitnessTrendModel) => {

			});*/

			this.dataSource.data = fitnessTrendModels;

		}, error => {

			// this.fitnessTrend = [];
			console.error(error);

		});
	}


	public ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
	}

}
