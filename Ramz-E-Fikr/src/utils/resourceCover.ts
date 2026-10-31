import { ResourceItem } from '../types';

/**
 * Returns a verified, high-fidelity public preview image URL for any debate vault resource.
 * All paths reference /assets/images/... which are located in /public/assets/images/
 * and served reliably to all users across development and production preview/shared domains.
 */
export function getResourceCoverImage(resource: ResourceItem): string {
  if (resource.cover_image_url) {
    return resource.cover_image_url;
  }

  const title = (resource.title || '').toLowerCase();
  const topic = (resource.topic || '').toLowerCase();
  const format = (resource.format || '').toLowerCase();
  const skill = (resource.skill_area || '').toLowerCase();

  // Philosophy, Ethics, Justice
  if (
    topic.includes('philosophy') ||
    topic.includes('ethics') ||
    title.includes('justice') ||
    title.includes('moral') ||
    title.includes('theories') ||
    skill.includes('critical thinking')
  ) {
    return '/assets/images/article_cover_philosophy_1791949946006.jpg';
  }

  // Geopolitics, International Relations, Foreign Policy, State Power
  if (
    topic.includes('international') ||
    topic.includes('geopolitics') ||
    title.includes('china') ||
    title.includes('state power') ||
    title.includes('palestine') ||
    title.includes('iran') ||
    title.includes('russia') ||
    title.includes('nato') ||
    title.includes('icc')
  ) {
    return '/assets/images/hero_debate_chamber_1791952563761.jpg';
  }

  // Prep, Rebuttal, Sparring, Motions, POIs
  if (
    skill.includes('rebuttal') ||
    skill.includes('case building') ||
    skill.includes('pois') ||
    skill.includes('motion') ||
    title.includes('rebuttal') ||
    title.includes('prep') ||
    title.includes('poi') ||
    title.includes('sparring')
  ) {
    return '/assets/images/motion_chamber_sparring_1791952563900.jpg';
  }

  // Weighing, Extensions, Economics, Public Finance
  if (
    topic.includes('economics') ||
    topic.includes('finance') ||
    skill.includes('weighing') ||
    skill.includes('extensions') ||
    title.includes('weigh') ||
    title.includes('extension') ||
    title.includes('monetary') ||
    title.includes('macroeconomic')
  ) {
    return '/assets/images/article_weighing_cover_1791952564020.jpg';
  }

  // Handbooks, Rules, Adjudication, Tabbycat
  if (
    skill.includes('adjudication') ||
    title.includes('handbook') ||
    title.includes('manual') ||
    title.includes('rules') ||
    title.includes('scale') ||
    title.includes('judge') ||
    title.includes('tabbing')
  ) {
    return '/assets/images/resource_cover_handbook_1791949945052.jpg';
  }

  // Default master library cover
  return '/assets/images/ramz_hero_library_1791949944526.jpg';
}
