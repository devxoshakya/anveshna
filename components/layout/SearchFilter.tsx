"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import {
  FaSortAmountDown,
  FaSortAmountDownAlt,
  FaCheckCircle,
  FaTrashAlt,
} from 'react-icons/fa';
import {
  Option,
  FilterProps,
  genreOptions,
  anyOption,
  yearOptions,
  seasonOptions,
  formatOptions,
  statusOptions,
  sortOptions,
} from '@/hooks/useFilters';

interface StateProps {
  data: {
    label: string;
  };
  isSelected: boolean;
  isFocused: boolean;
}

const selectStyles: any = {
  placeholder: (provided: object) => ({
    ...provided,
    color: 'var(--muted-foreground)',
  }),
  singleValue: (provided: object, state: StateProps) => ({
    ...provided,
    color:
      state.data.label === 'Popularity' || state.data.label === 'Any'
        ? 'var(--muted-foreground)'
        : 'var(--primary)',
  }),
  control: (provided: object) => ({
    ...provided,
    width: '11.5rem',
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    borderWidth: '2px',
    color: 'var(--foreground)',
    boxShadow: 'var(--shadow-sm)',
    borderRadius: 'var(--radius)',
    '&:hover': {
      borderColor: 'var(--primary)',
      transform: 'translateY(-2px)',
    },
    '@media (max-width: 768px)': {
      width: '10rem',
    },
    '@media (max-width: 640px)': {
      width: '100%',
    },
  }),
  menuList: (provided: object) => ({
    ...provided,
    '::-webkit-scrollbar': { display: 'none' },
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    overflow: 'auto'
  }),
  menu: (provided: object) => ({
    ...provided,
    zIndex: 5,
    padding: '0.25rem',
    backgroundColor: 'var(--popover)',
    borderColor: 'var(--border)',
    color: 'var(--popover-foreground)',
    borderRadius: 'var(--radius)',
    boxShadow: '0 2px 0 0 var(--border)',
    '@media (max-width: 640px)': {
      width: '100%',
      minWidth: '100%'
    },
    // Hide scrollbar styles
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    overflow: 'auto'
  }),
  option: (provided: object, state: StateProps) => ({
    ...provided,
    backgroundColor:
      state.isSelected || state.isFocused
        ? 'var(--accent)'
        : 'var(--popover)',
    color:
      state.isSelected || state.isFocused
        ? 'var(--primary)'
        : 'var(--popover-foreground)',
    borderRadius: 'var(--radius-sm)',
    '&:hover': {
      backgroundColor: 'var(--accent)',
      color: 'var(--primary)',
    },
    marginBottom: '0.25rem',
    transition: 'all 0.2s ease-in-out',
  }),
  multiValue: (provided: object) => ({
    ...provided,
    backgroundColor: 'var(--muted)',
    borderRadius: 'var(--radius-sm)',
  }),
  multiValueLabel: (provided: object) => ({
    ...provided,
    color: 'var(--foreground)',
  }),
  multiValueRemove: (provided: object) => ({
    ...provided,
    '&:hover': {
      backgroundColor: 'var(--primary)',
      color: 'var(--primary-foreground)',
    },
  }),
};

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.25rem;
  background-color: var(--background);
  border-radius: var(--radius);
  
  /* Hide scrollbars */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
  
  @media (max-width: 640px) {
    padding: 1rem 0.875rem;
    gap: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem 0.75rem;
    gap: 1rem;
  }
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11.5rem, 1fr));
  grid-template-rows: auto;
  margin: 0 auto;
  position: relative;
  gap: 1.5rem;
  justify-content: left;
  align-items: flex-start;
  font-size: 0.9rem;
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 1.25rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 0.75rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem 0.5rem;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 0.5rem;
  margin-top: 1rem;
  
  @media (max-width: 640px) {
    gap: 0.375rem;
    width: 100%;
  }
`;

const FilterLabel = styled.label`
  font-weight: var(--font-weight-medium);
  font-size: 0.9rem;
  color: var(--foreground);
  margin-bottom: 0.25rem;
  
  @media (max-width: 640px) {
    font-size: 0.85rem;
    margin-bottom: 0.2rem;
  }
`;

const ButtonBase = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  width: 3rem;
  height: 3rem;
  border: 2px solid var(--border);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius);
  cursor: pointer;
  background-color: var(--card);
  color: var(--card-foreground);
  transition: all 0.2s ease-in-out;
  text-align: center;
  box-shadow: 0 2px 0 0 var(--border);
  
  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  @media (max-width: 500px) {
    width: 2.75rem;
    height: 2.75rem;
    padding: 0.6rem;
  }
`;

const Button = styled(ButtonBase)`
  &.active {
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary-border);
  }
`;

const ClearFilters = styled(ButtonBase)`
  &:hover,
  &:active,
  &:focus {
    background-color: var(--destructive);
    color: var(--destructive-foreground);
    border-color: var(--destructive-border);
    box-shadow: 0 2px 0 0 var(--destructive-border);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.75rem;

  @media (max-width: 640px) {
    justify-content: start;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
`;

const animatedComponents = makeAnimated();

const FilterSelect: React.FC<FilterProps> = ({
  label,
  options,
  onChange,
  value,
  isMulti = false,
}) => {
  //Add Check Circle to clicked option
  const CustomOption = (props: any) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{props.data.label}</span>
          {props.isSelected && <FaCheckCircle style={{ marginLeft: '10px' }} />}
        </div>
      </components.Option>
    );
  };
  
  return (
    <FilterSection>
      <FilterLabel>
        {label}
      </FilterLabel>
      <Select
        components={{
          ...animatedComponents,
          Option: CustomOption,
          IndicatorSeparator: () => null,
        }}
        isMulti={isMulti}
        options={options}
        onChange={onChange}
        value={value}
        placeholder='Any'
        styles={selectStyles}
        isSearchable={false}
        className='w-32 md:w-auto'  
      />
    </FilterSection>
  );
};

export const SearchFilters: React.FC<{
  selectedGenres: Option[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<Option[]>>;
  selectedYear: Option;
  setSelectedYear: React.Dispatch<React.SetStateAction<Option>>;
  selectedSeason: Option;
  setSelectedSeason: React.Dispatch<React.SetStateAction<Option>>;
  selectedFormat: Option;
  setSelectedFormat: React.Dispatch<React.SetStateAction<Option>>;
  selectedStatus: Option;
  setSelectedStatus: React.Dispatch<React.SetStateAction<Option>>;
  selectedSort: Option;
  setSelectedSort: React.Dispatch<React.SetStateAction<Option>>;
  sortDirection: 'DESC' | 'ASC';
  setSortDirection: React.Dispatch<React.SetStateAction<'DESC' | 'ASC'>>;
  updateSearchParams: () => void; // Added prop for updating search params
}> = ({
  selectedGenres,
  setSelectedGenres,
  selectedYear,
  setSelectedYear,
  selectedSeason,
  setSelectedSeason,
  selectedFormat,
  setSelectedFormat,
  selectedStatus,
  setSelectedStatus,
  selectedSort,
  setSelectedSort,
  sortDirection,
  setSortDirection,
  updateSearchParams,
}) => {
  // State to track if any filter is changed from its default value
  const [filtersChanged, setFiltersChanged] = useState(false);

  const handleResetFilters = () => {
    setSelectedGenres([]);
    setSelectedYear(anyOption);
    setSelectedSeason(anyOption);
    setSelectedFormat(anyOption);
    setSelectedStatus(anyOption);
    setSelectedSort({ value: 'POPULARITY_DESC', label: 'Popularity' });
    setSortDirection('DESC');
    updateSearchParams(); // Also reset URL parameters
  };

  useEffect(() => {
    const hasFiltersChanged = 
    
      selectedGenres.length > 0 || // Check if any genres are selected
      selectedYear.value !== anyOption.value || // Check if year is not "Any"
      selectedSeason.value !== anyOption.value || // Same for season, type, status...
      selectedFormat.value !== anyOption.value ||
      selectedStatus.value !== anyOption.value ||
      selectedSort.value !== 'POPULARITY_DESC' || // Check if sort criteria is not "Popularity"
      sortDirection !== 'DESC'; // Check if sort direction is not descending

    setFiltersChanged(hasFiltersChanged);
  }, [
    selectedGenres,
    selectedYear,
    selectedSeason,
    selectedFormat,
    selectedStatus,
    selectedSort,
    sortDirection,
  ]);

  const handleChange =
    (
      setter:
        | React.Dispatch<React.SetStateAction<Option[]>>
        | React.Dispatch<React.SetStateAction<Option>>
    ) =>
    (
      newValue: React.SetStateAction<Option[]> &
        React.SetStateAction<Option>
    ) => {
      setter(newValue);
      updateSearchParams();
    };

  return (
    <FiltersWrapper>
      <div>
        <FiltersContainer>
          <FilterSelect
            label='Genres'
            options={genreOptions}
            isMulti
            onChange={handleChange(setSelectedGenres)}
            value={selectedGenres}
          />
          <FilterSelect
            label='Year'
            options={yearOptions}
            onChange={handleChange(setSelectedYear)}
            value={selectedYear}
          />
          <FilterSelect
            label='Season'
            options={seasonOptions}
            onChange={handleChange(setSelectedSeason)}
            value={selectedSeason}
          />
          <FilterSelect
            label='Type'
            options={formatOptions}
            onChange={handleChange(setSelectedFormat)}
            value={selectedFormat}
          />
          <FilterSelect
            label='Status'
            options={statusOptions}
            onChange={handleChange(setSelectedStatus)}
            value={selectedStatus}
          />
          <FilterSelect
            label='Sort By'
            options={sortOptions}
            onChange={handleChange(setSelectedSort)}
            value={selectedSort}
          />
        </FiltersContainer>
      </div>
      <ButtonContainer>
        <Button
          onClick={() => {
            setSortDirection(sortDirection === 'DESC' ? 'ASC' : 'DESC');
            updateSearchParams(); // Ensure sort direction changes also update URL
          }}
        >
          {sortDirection === 'DESC' ? (
            <FaSortAmountDown />
          ) : (
            <FaSortAmountDownAlt />
          )}
        </Button>
        {filtersChanged && (
          <ClearFilters onClick={handleResetFilters}>
            <FaTrashAlt />
          </ClearFilters>
        )}
      </ButtonContainer>
    </FiltersWrapper>
  );
};