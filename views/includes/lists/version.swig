{% import '../../macros.swig' as macros %}

{% if version %}
    <dt>{{ translate('headings.version') }}</dt>
    <dd>{{ version|resolveLinks|markdown }}</dd>
{% endif %}
