using System;
using System.Collections.Generic;

namespace OOPGSM.Common
{
    public class Display
    {
		private double? sizeInches;
		private int? colorDepth;

		public double? SizeInches
		{
			get { return this.sizeInches; }
			set {
				if ((2.0 < value) && (value < 6.1))
				{
					this.sizeInches = value; 	
				}
				else
				{
					throw new ArgumentOutOfRangeException("SizeInches", "Display size in range [2.0 - 6.1]");
				}
			}
		}

		
		public int? ColorDepth
		{
			get { return this.colorDepth; }
			set {				
				this.colorDepth = value; 
			}
		}

		public Display() 
		{
			this.sizeInches = null;
			this.colorDepth = null;
		}

		public Display(double? sizeInches = null, int? colorDepth = null)
		{
			this.sizeInches = sizeInches;
			this.colorDepth = colorDepth;
		}
    }
}
