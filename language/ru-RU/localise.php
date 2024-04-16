<?php
/**
 * @package	Joomla.Language
 *
 * @copyright	(C) 2005 - 2024 Open Source Matters, Inc. <https://www.joomla.org>
 * @license	GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use \Joomla\String\StringHelper;

/**
 * ru-RU localise class
 *
 * @since 1.6
 */
abstract class Ru_RULocalise
{
	/**
	 * Returns the potential suffixes for a specific number of items
	 *
	 * @param   integer  $count  The number of items
	 *
	 * @return  array  An array of potential suffixes
	 *
	 * @since   1.6
	 */
	public static function getPluralSuffixes($count)
	{
		if ($count == 0)
		{
			$return = ['0'];

		} else {
			$return = [($count%10==1 && $count%100!=11 ? '1' : ($count%10>=2 && $count%10<=4 && ($count%100<10 || $count%100>=20)? '2' : 'MORE'))];

		}

		return $return;
	}

	public static function transliterate($string)
	{
		$str = StringHelper::strtolower($string);

		$glyph_array = [
			'a'	=> 'á,Á,α,ά,ą,Ą,ä,Ä,ā,а',
			'b'	=> 'β,б',
			'v'	=> 'в',
			'g'	=> 'γ,ğ,Ğ,ģ,ґ,г',
			'd'	=> 'ď,Ď,đ,Đ,δ,ð,д',
			'e'	=> 'ě,Ě,ε,έ,é,É,ë,Ë,ę,Ę,ē,е,є,э',
			'jo'	=> 'ё',
			'zh'	=> 'ж',
			'z'	=> 'ž,Ž,ź,Ź,ζ,з',
			'i'	=> 'í,Í,η,ή,ι,ί,í,Í,į,и,і',
			'ji'	=> 'ї',
			'j'	=> 'й',
			'k'	=> 'к',
			'l'	=> 'λ,Λ,ł,Ł,ľ,Ľ,ĺ,Ĺ,ļ,л',
			'm'	=> 'μ,м',
			'n'	=> 'ń,Ń,ň,Ň,ñ,Ñ,ņ,н',
			'o'	=> 'ó,Ó,ω,Ώ,ώ,ö,Ö,ő,Ő,ô,Ô,о',
			'p'	=> 'π,п',
			'r'	=> 'ř,Ř,ŕ,Ŕ,ρ,р',
			's'	=> 'š,Š,σ,ς,ś,Ś,ş,с',
			't'	=> 'ť,Ť,τ,ť,т',
			'u'	=> 'ú,Ú,ů,Ů,υ,ύ,ϋ,Ü,ü,ű,Ű,ų,ū,ΰ,у',
			'f'	=> 'φ,ф',
			'kh'	=> 'х',
			'ts'	=> 'ц',
			'ch'	=> 'ч',
			'sh'	=> 'ш',
			'shch'	=> 'щ',
			''	=> 'ъ,ь',
			'y'	=> 'ý,Ý,ы',
			'yu'	=> 'ю',
			'ya'	=> 'я',

			'ae'	=> 'æ,Æ',
			'c'	=> 'č,Č,ć,Ć,ç',
			'ks'	=> 'ξ,Ξ',
			'ps'	=> 'ψ,Ψ',
			'ss'	=> 'ß',
			'x'	=> 'χ',

			'eur'	=> '€',
			'rub'	=> '₽',
			'uah'	=> '₴',
			'usd'	=> '$',
		];

		foreach ($glyph_array as $letter => $glyphs)
		{
			$glyphs = explode(',', $glyphs);
			$str = StringHelper::str_ireplace($glyphs, $letter, $str);
		}

		$str = preg_replace('#\&\#?[a-z0-9]+\;#ismu', '', $str);

		return $str;
	}
}
