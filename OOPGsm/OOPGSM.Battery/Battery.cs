using System;
using System.Collections.Generic;
using System.Text;

namespace OOPGSM.Common
{
    public class Battery
    {
		
		private double? hoursIdle;
		private double? hoursTalk;
		private string model;
		private BattType battType = new BattType(); 

		public double? HoursIdle
		{
			get { return this.hoursIdle; }
			set {
				if (value < 0)
				{
					throw new ArgumentOutOfRangeException("HoursIdle", "Hours idle cannot be negative");
				}
				this.hoursIdle = value; 
			}
		}
		
		public double? HoursTalk
		{
			get { return this.hoursTalk; }
			set 
			{
				if (value < 0)
				{
					throw new ArgumentOutOfRangeException("HoursTalk", "Hours talk time cannot be negative");
				}
				this.hoursTalk = value; 
			}
		}

		public string Model
		{
			get { return this.model; }
			set { this.model = value; }
		}

		public BattType BatteryType
		{
			get { return this.battType; }
			set { this.battType = value; }
		}

		public Battery()
		{
			this.hoursIdle = null;
			this.hoursTalk = null;
			this.model = null;
			this.battType = BattType.liIon;
		}

		public Battery(double? hoursIdle = null, double? hoursTalk = null, string model = null, BattType batteryType = BattType.liIon)
		{
			this.hoursIdle = hoursIdle;
			this.hoursTalk = hoursTalk;
			this.model = model;
			this.battType = batteryType;
		}
		
    }
}
