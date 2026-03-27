import svgPaths from "./svg-g4q599979o";

function Time() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[22px] items-center justify-center min-h-px min-w-px pt-[1.5px] relative" data-name="Time">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[#252525] text-[17px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        9:41
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[13px] relative shrink-0 w-[27.328px]" data-name="Frame">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.328 13">
        <g id="Frame">
          <rect height="12" id="Border" opacity="0.35" rx="3.8" stroke="var(--stroke-0, #252525)" width="24" x="0.5" y="0.5" />
          <path d={svgPaths.p7a14d80} fill="var(--fill-0, #252525)" id="Cap" opacity="0.4" />
          <rect fill="var(--fill-0, #252525)" height="9" id="Capacity" rx="2.5" width="21" x="2" y="2" />
        </g>
      </svg>
    </div>
  );
}

function Levels() {
  return (
    <div className="flex-[1_0_0] h-[22px] min-h-px min-w-px relative" data-name="Levels">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[7px] items-center justify-center pr-px pt-px relative size-full">
          <div className="h-[12.226px] relative shrink-0 w-[19.2px]" data-name="Cellular Connection">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 12.2264">
              <path clipRule="evenodd" d={svgPaths.p1e09e400} fill="var(--fill-0, #252525)" fillRule="evenodd" id="Cellular Connection" />
            </svg>
          </div>
          <div className="h-[12.328px] relative shrink-0 w-[17.142px]" data-name="Wifi">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1417 12.3283">
              <path clipRule="evenodd" d={svgPaths.p18b35300} fill="var(--fill-0, #252525)" fillRule="evenodd" id="Wifi" />
            </svg>
          </div>
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute font-['Helvetica:Light',sans-serif] h-[22px] leading-[22px] left-[19px] not-italic text-[12px] text-black top-[126px] w-[284px] whitespace-nowrap">
      <p className="absolute left-0 top-0">All info (43)</p>
      <p className="absolute left-[75px] top-0">Design News</p>
      <p className="absolute left-[161px] top-0">Paper</p>
      <p className="absolute left-[208px] top-0">Design Award</p>
      <p className="absolute left-[66px] top-0">/</p>
      <p className="absolute left-[152px] top-0">/</p>
      <p className="absolute left-[199px] top-0">/</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[302px] left-[18px] top-[163px] w-[367px]">
      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[22px] left-0 not-italic text-[24px] text-black top-[232px] whitespace-nowrap">Design News title 1th example</p>
      <p className="absolute font-['Helvetica:Regular',sans-serif] h-[45px] leading-[0] left-px not-italic text-[14px] text-black top-[257px] w-[366px]">
        <span className="leading-[22px]">{`This is an example of a `}</span>
        <span className="font-['Times_New_Roman:Italic',sans-serif] italic leading-[22px]">component</span>
        <span className="leading-[22px]">{` in the main body of a design consultation post.`}</span>
      </p>
      <p className="absolute font-['Times_New_Roman:Italic',sans-serif] italic leading-[22px] left-px text-[#474747] text-[14px] top-[202px] whitespace-nowrap">Design News</p>
      <div className="absolute bg-[#d9d9d9] h-[194px] left-px top-0 w-[366px]" data-name="image" />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute h-[302px] left-[18px] top-[491px] w-[367px]">
      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[22px] left-0 not-italic text-[24px] text-black top-[232px] whitespace-nowrap">Paper title 1th example</p>
      <p className="absolute font-['Helvetica:Regular',sans-serif] h-[45px] leading-[0] left-px not-italic text-[14px] text-black top-[257px] w-[366px]">
        <span className="leading-[22px]">{`This is an example of a `}</span>
        <span className="font-['Times_New_Roman:Italic',sans-serif] italic leading-[22px]">component</span>
        <span className="leading-[22px]">{` in the main body of a design paper post.`}</span>
      </p>
      <p className="absolute font-['Times_New_Roman:Italic',sans-serif] italic leading-[22px] left-px text-[#474747] text-[14px] top-[202px] whitespace-nowrap">Paper</p>
      <div className="absolute bg-[#d9d9d9] h-[194px] left-px top-0 w-[366px]" data-name="image" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute h-[302px] left-[19px] top-[819px] w-[367px]">
      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[22px] left-0 not-italic text-[24px] text-black top-[232px] whitespace-nowrap">Design Award title 1th example</p>
      <p className="absolute font-['Helvetica:Regular',sans-serif] h-[45px] leading-[0] left-px not-italic text-[14px] text-black top-[257px] w-[366px]">
        <span className="leading-[22px]">{`This is an example of a `}</span>
        <span className="font-['Times_New_Roman:Italic',sans-serif] italic leading-[22px]">component</span>
        <span className="leading-[22px]">{` in the main body of a design Design Award info.`}</span>
      </p>
      <p className="absolute font-['Times_New_Roman:Italic',sans-serif] italic leading-[22px] left-px text-[#474747] text-[14px] top-[202px] whitespace-nowrap">Design Award</p>
      <div className="absolute bg-[#d9d9d9] h-[194px] left-px top-0 w-[366px]" data-name="image" />
    </div>
  );
}

function Left({ className }: { className?: string }) {
  return (
    <div className={className || "absolute left-0 size-[32px] top-0"} data-name="Left (左)">
      <div className="absolute inset-[20.84%_31.25%_20.83%_35.42%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6663 18.6658">
          <path d={svgPaths.p1ec740} fill="var(--fill-0, #333333)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute h-[32px] left-[8px] top-[83px] w-[158px]">
      <p className="absolute font-['Helvetica:Bold',sans-serif] leading-[22px] left-[36px] not-italic text-[24px] text-black top-[5px] whitespace-nowrap">My Library</p>
      <Left />
    </div>
  );
}

export default function SettingCollectionInternal() {
  return (
    <div className="bg-white relative size-full" data-name="Setting-Collection-internal">
      <div className="absolute bg-white h-[874px] left-0 top-0 w-[402px]" />
      <div className="absolute content-stretch flex gap-[154px] items-center justify-center left-0 pb-[19px] pt-[21px] px-[24px] right-0 top-0" data-name="Status bar">
        <Time />
        <Levels />
      </div>
      <Frame4 />
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame5 />
    </div>
  );
}