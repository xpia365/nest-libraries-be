import { FFmPegCmdOptions } from './args.interface';

export const selectEntries: FFmPegCmdOptions = {
  '*': '*',
  index: 'index',
  codec_name: 'codec_name',
  codec_long_name: 'codec_long_name',
  profile: 'profile',
  codec_type: 'codec_type',
  codec_tag_string: 'codec_tag_string',
  codec_tag: 'codec_tag',
  width: 'width',
  height: 'height',
  coded_width: 'coded_width',
  coded_height: 'coded_height',
  closed_captions: 'closed_captions',
  has_b_frames: 'has_b_frames',
  sample_aspect_ratio: 'sample_aspect_ratio',
  display_aspect_ratio: 'display_aspect_ratio',
  pix_fmt: 'pix_fmt',
  level: 'level',
  color_range: 'color_range',
  color_space: 'color_space',
  color_transfer: 'color_transfer',
  color_primaries: 'color_primaries',
  chroma_location: 'chroma_location',
  field_order: 'field_order',
  refs: 'refs',
  is_avc: 'is_avc',
  nal_length_size: 'nal_length_size',
  id: 'id',
  r_frame_rate: 'r_frame_rate',
  avg_frame_rate: 'avg_frame_rate',
  time_base: 'time_base',
  start_pts: 'start_pts',
  start_time: 'start_time',
  duration_ts: 'duration_ts',
  duration: 'duration',
  bit_rate: 'bit_rate',
  max_bit_rate: 'max_bit_rate',
  bits_per_raw_sample: 'bits_per_raw_sample',
  nb_frames: 'nb_frames',
  nb_read_frames: 'nb_read_frames',
  nb_read_packets: 'nb_read_packets',
  'DISPOSITION:default': 'DISPOSITION:default',
  'DISPOSITION:dub': 'DISPOSITION:dub',
  'DISPOSITION:original': 'DISPOSITION:original',
  'DISPOSITION:comment': 'DISPOSITION:comment',
  'DISPOSITION:lyrics': 'DISPOSITION:lyrics',
  'DISPOSITION:karaoke': 'DISPOSITION:karaoke',
  'DISPOSITION:forced': 'DISPOSITION:forced',
  'DISPOSITION:hearing_impaired': 'DISPOSITION:hearing_impaired',
  'DISPOSITION:visual_impaired': 'DISPOSITION:visual_impaired',
  'DISPOSITION:clean_effects': 'DISPOSITION:clean_effects',
  'DISPOSITION:attached_pic': 'DISPOSITION:attached_pic',
  'DISPOSITION:timed_thumbnails': 'DISPOSITION:timed_thumbnails',
  'TAG:language': 'TAG:language',
  'TAG:handler_name': 'TAG:handler_name',
  'TAG:vendor_id': 'TAG:vendor_id',
};

export const ffmPegCmdOptions: FFmPegCmdOptions = {
  v: '-v error',
  select_streams: '-select_streams v:0',
  show_entries: '-show_entries stream=*',
  of: '-of csv=p=0',
  p: '-print_format json',
  i: '-i *',
  o: '*',
  codec: '-codec: copy',
  start_number: '-start_number 0',
  hls_time: '-hls_time 10',
  hls_list_size: '-hls_list_size 0',
  f: '-f hls',
};