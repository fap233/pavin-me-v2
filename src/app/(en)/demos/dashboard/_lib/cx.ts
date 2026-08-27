/** Junta classes condicionais sem depender de util fora da pasta da demo. */
export function cx(...parts: Array<string | false | null | undefined>): string {
	return parts.filter(Boolean).join(" ");
}
