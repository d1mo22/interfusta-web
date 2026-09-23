import { Fragment } from "react";

/**
 * Deterministic tree-ring geometry, ported from the 404/500 mockups'
 * browser-side generator (seeded Park–Miller PRNG + sine wobble). Runs at
 * request/render time on the server so the SVG paths ship as plain markup —
 * no client JS, no hydration, same output every time for a given seed.
 */
function createRng(seed: number) {
	let value = seed;
	return () => {
		value = (value * 16807) % 2147483647;
		return value / 2147483647;
	};
}

interface RingPath {
	d: string;
	isBark: boolean;
	delayS: number;
}

function generateRings(seed: number, count: number, radius: number): RingPath[] {
	const rand = createRng(seed);
	const phases = [rand() * 6.28, rand() * 6.28, rand() * 6.28];
	const rings: RingPath[] = [];

	for (let i = count; i >= 1; i--) {
		const r = radius * Math.pow(i / count, 0.9);
		const pts: string[] = [];
		for (let k = 0; k <= 72; k++) {
			const t = (k / 72) * Math.PI * 2;
			const wob =
				1 +
				0.05 * Math.sin(3 * t + phases[0]) +
				0.03 * Math.sin(5 * t + phases[1] + i * 0.3) +
				0.015 * Math.sin(9 * t + phases[2]) +
				(rand() - 0.5) * 0.012;
			const x = (r * wob * Math.cos(t) * 0.92).toFixed(1);
			const y = (r * wob * Math.sin(t) * 1.08).toFixed(1);
			pts.push(`${x} ${y}`);
		}
		rings.push({
			d: `M${pts.join(" L")}Z`,
			isBark: i === count,
			delayS: (count - i) * 0.07,
		});
	}

	return rings;
}

const RING_COUNT = 11;
const RING_RADIUS = 140;
const RING_Y = 215;
const DIGIT_FONT_SIZE = 300;
// Bricolage Grotesque's digit glyphs at wdth 80 sit with their visual centre
// roughly a third of the font-size above the baseline. Subtracting that from
// the ring's vertical centre lines the outlined digits up optically with the
// rings instead of sitting on the same baseline as their (much larger) box.
const DIGIT_BASELINE_Y = RING_Y + 0.33 * DIGIT_FONT_SIZE;
// Rough visual width of a single glyph at the above size/variation — used
// only to estimate the drawing's right edge for the viewBox and dimension
// lines, not for placement of the glyph itself.
const DIGIT_VISUAL_WIDTH = 165;
const FIRST_RING_CENTER_X = 305;
const RING_SPACING = 290;
const DIGIT_GAP_AFTER_RING = RING_RADIUS + 10;
const VIEW_MIN_X = -20;
const DIM_TOP_HALF_SPAN = 129;

type Slot =
	| { type: "digit"; ch: string; x: number }
	| { type: "ring"; center: number; ringIndex: number };

/**
 * Lays characters out left to right: "0" becomes a ring slot, anything else
 * an outlined-digit slot. Ring centres and digit positions are derived from
 * the previous slot rather than hard-coded per code, so a new code (e.g.
 * "500") gets a correct layout without touching this function.
 */
function layoutCode(code: string): Slot[] {
	const slots: Slot[] = [];
	let lastRingCenter: number | null = null;
	let ringIndex = 0;

	for (const ch of code) {
		if (ch === "0") {
			const center: number =
				lastRingCenter === null ? FIRST_RING_CENTER_X : lastRingCenter + RING_SPACING;
			slots.push({ type: "ring", center, ringIndex });
			lastRingCenter = center;
			ringIndex += 1;
		} else {
			const x = lastRingCenter === null ? 0 : lastRingCenter + DIGIT_GAP_AFTER_RING;
			slots.push({ type: "digit", ch, x });
		}
	}

	return slots;
}

function computeGeometry(slots: Slot[]) {
	const last = slots[slots.length - 1];
	const contentRight =
		last.type === "ring" ? last.center + RING_RADIUS : last.x + DIGIT_VISUAL_WIDTH;
	const heightDimX = contentRight + 20;
	const viewBoxMaxX = heightDimX + 20;
	const widthDimX2 = viewBoxMaxX - 60;
	return { heightDimX, viewBoxMaxX, widthDimX2 };
}

export type ErrorSheetTitleRow = [label: string, value: string, highlight?: boolean];

export interface ErrorSheetDimensions {
	/** Label over the featured ring, e.g. "Ø 404 mm" or "Esquerda · 500". */
	topLabel: string;
	heightLabel: string;
	widthLabel: string;
}

export interface ErrorSheetProps {
	/** Digits/characters to draw; each "0" becomes a tree-ring, others become outlined glyphs. */
	code: string;
	titleBlock: {
		title: string;
		rows: ErrorSheetTitleRow[];
	};
	/** Defaults to the 404 sheet's labels. */
	dimensions?: ErrorSheetDimensions;
	/** PRNG seed per ring, in left-to-right order. Defaults to 3 for every ring. */
	ringSeeds?: number[];
	/** Index (within the rings only) of the ring that gets the orange crack overlay. */
	crackedRingIndex?: number;
	/** Delay, in seconds, before the dimension lines fade in. */
	dimsDelayS?: number;
}

const DEFAULT_DIMENSIONS: ErrorSheetDimensions = {
	topLabel: "Ø 404 mm",
	heightLabel: "420",
	widthLabel: "1 280",
};

export function ErrorSheet({
	code,
	titleBlock,
	dimensions = DEFAULT_DIMENSIONS,
	ringSeeds,
	crackedRingIndex,
	dimsDelayS = 1.6,
}: ErrorSheetProps) {
	const slots = layoutCode(code);
	const { heightDimX, viewBoxMaxX, widthDimX2 } = computeGeometry(slots);
	const viewBoxWidth = viewBoxMaxX - VIEW_MIN_X;
	const ringCenters = slots.filter((s): s is Extract<Slot, { type: "ring" }> => s.type === "ring");
	const featuredRingCenter =
		ringCenters.length > 0 ? ringCenters[ringCenters.length - 1].center : null;
	const widthDimMidX = widthDimX2 / 2;

	return (
		<div
			className="relative border border-ink bg-paper px-5 pb-14 pt-10 md:px-12 md:pb-14 md:pt-10"
			style={{
				backgroundImage:
					"linear-gradient(var(--hairline) 1px, transparent 1px), linear-gradient(90deg, var(--hairline) 1px, transparent 1px)",
				backgroundSize: "24px 24px",
				backgroundPosition: "-1px -1px",
			}}
		>
			<svg
				viewBox={`${VIEW_MIN_X} 0 ${viewBoxWidth} 450`}
				aria-hidden="true"
				className="block h-auto w-full max-w-[720px] overflow-visible"
			>
				{slots.map((slot, i) =>
					slot.type === "digit" ? (
						<text key={i} x={slot.x} y={DIGIT_BASELINE_Y} className="num-outline font-display">
							{slot.ch}
						</text>
					) : (
						<g key={i} transform={`translate(${slot.center} ${RING_Y})`}>
							{generateRings(ringSeeds?.[slot.ringIndex] ?? 3, RING_COUNT, RING_RADIUS).map(
								(ring, ri) => (
									<path
										key={ri}
										d={ring.d}
										pathLength={1}
										className={`ring-path${ring.isBark ? " ring-path--bark" : ""}`}
										style={{ animationDelay: `${ring.delayS}s` }}
									/>
								),
							)}
							<circle r={5} className="fill-brand" />
							{crackedRingIndex === slot.ringIndex && (
								<polygon
									points="6,-4 132,-62 128,-40"
									className="fill-brand dim-fade"
									style={{ animationDelay: "1.5s" }}
								/>
							)}
						</g>
					),
				)}

				{featuredRingCenter !== null && (
					<g className="dim-fade" style={{ animationDelay: `${dimsDelayS}s` }}>
						<line
							className="stroke-brand"
							strokeWidth={1}
							x1={featuredRingCenter - DIM_TOP_HALF_SPAN}
							y1={30}
							x2={featuredRingCenter + DIM_TOP_HALF_SPAN}
							y2={30}
						/>
						<line
							className="stroke-brand"
							strokeWidth={1}
							x1={featuredRingCenter - DIM_TOP_HALF_SPAN}
							y1={20}
							x2={featuredRingCenter - DIM_TOP_HALF_SPAN}
							y2={62}
						/>
						<line
							className="stroke-brand"
							strokeWidth={1}
							x1={featuredRingCenter + DIM_TOP_HALF_SPAN}
							y1={20}
							x2={featuredRingCenter + DIM_TOP_HALF_SPAN}
							y2={62}
						/>
						<rect x={featuredRingCenter - 50} y={21} width={100} height={18} className="fill-paper" />
						<text
							x={featuredRingCenter}
							y={34}
							textAnchor="middle"
							className="font-mono text-[12px] fill-brand-ink"
						>
							{dimensions.topLabel}
						</text>

						<line className="stroke-brand" strokeWidth={1} x1={heightDimX} y1={64} x2={heightDimX} y2={366} />
						<line
							className="stroke-brand"
							strokeWidth={1}
							x1={heightDimX - 10}
							y1={64}
							x2={heightDimX + 10}
							y2={64}
						/>
						<line
							className="stroke-brand"
							strokeWidth={1}
							x1={heightDimX - 10}
							y1={366}
							x2={heightDimX + 10}
							y2={366}
						/>
						<rect x={heightDimX - 9} y={200} width={18} height={30} className="fill-paper" />
						<text
							x={heightDimX}
							y={215}
							textAnchor="middle"
							transform={`rotate(-90 ${heightDimX} 215)`}
							className="font-mono text-[12px] fill-brand-ink"
						>
							{dimensions.heightLabel}
						</text>

						<line className="stroke-brand" strokeWidth={1} x1={0} y1={420} x2={widthDimX2} y2={420} />
						<line className="stroke-brand" strokeWidth={1} x1={0} y1={410} x2={0} y2={430} />
						<line
							className="stroke-brand"
							strokeWidth={1}
							x1={widthDimX2}
							y1={410}
							x2={widthDimX2}
							y2={430}
						/>
						<rect x={widthDimMidX - 35} y={411} width={70} height={18} className="fill-paper" />
						<text
							x={widthDimMidX}
							y={424}
							textAnchor="middle"
							className="font-mono text-[12px] fill-brand-ink"
						>
							{dimensions.widthLabel}
						</text>
					</g>
				)}
			</svg>

			<div
				className="mt-8 grid grid-cols-2 border border-ink bg-paper font-mono text-xs md:absolute md:bottom-0 md:right-0 md:mt-0 [&>div]:border-[0.5px] [&>div]:border-ink [&>div]:px-3.5 [&>div]:py-2"
			>
				<div className="col-span-2 font-display text-xl font-semibold tracking-[-0.02em]">
					{titleBlock.title}
				</div>
				{titleBlock.rows.map(([label, value, highlight]) => (
					<Fragment key={label}>
						<div>{label}</div>
						<div className={highlight ? "text-brand-ink" : undefined}>{value}</div>
					</Fragment>
				))}
			</div>
		</div>
	);
}
